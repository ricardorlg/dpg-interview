import * as fs from "fs";
import { Document, DOMParser, Element, XMLSerializer } from "@xmldom/xmldom";

interface TestCase {
  name: string;
  classname: string;
  time: string;
  status: "passed" | "failed" | "skipped" | "error";
  element: Element;
  executionOrder: number;
}

class JUnitMerger {
  private parser = new DOMParser();
  private serializer = new XMLSerializer();

  /**
   * Merge retried tests in a JUnit XML file, keeping only the latest execution result
   * @param inputPath Path to the input JUnit XML file
   * @param outputPath Path to save the merged result (optional, defaults to input path)
   */
  public mergeRetriedTests(inputPath: string, outputPath?: string): void {
    try {
      const xmlContent = fs.readFileSync(inputPath, "utf-8");
      const doc = this.parser.parseFromString(xmlContent, "text/xml");

      // Find all testsuites
      const testsuites = doc.getElementsByTagName("testsuite");

      for (let i = 0; i < testsuites.length; i++) {
        const testsuite = testsuites[i];
        this.mergeTestsInSuite(testsuite);
      }

      // Update testsuite statistics
      this.updateTestsuiteStats(doc);

      // Save the result
      const mergedXml = this.serializer.serializeToString(doc);
      const finalOutputPath = outputPath || inputPath;
      fs.writeFileSync(finalOutputPath, this.formatXml(mergedXml));

      console.log(`✅ Merged JUnit XML saved to: ${finalOutputPath}`);
    } catch (error) {
      console.error("❌ Error processing JUnit XML:", error);
      throw error;
    }
  }

  private mergeTestsInSuite(testsuite: Element): void {
    const testcases = testsuite.getElementsByTagName("testcase");
    const testMap = new Map<string, TestCase[]>();

    // Group tests by their unique identifier (name + classname)
    for (let i = 0; i < testcases.length; i++) {
      const testcase = testcases[i];
      const name = testcase.getAttribute("name") || "";
      const classname = testcase.getAttribute("classname") || "";
      const time = testcase.getAttribute("time") || "0";

      const testKey = `${classname}::${name}`;
      const status = this.getTestStatus(testcase);

      const testInfo: TestCase = {
        name,
        classname,
        time,
        status,
        element: testcase,
        executionOrder: i, // Use original order as execution order
      };

      if (!testMap.has(testKey)) {
        testMap.set(testKey, []);
      }
      testMap.get(testKey)!.push(testInfo);
    }

    // Remove all existing testcases
    const testcasesToRemove: Element[] = [];
    for (let i = 0; i < testcases.length; i++) {
      testcasesToRemove.push(testcases[i]);
    }
    testcasesToRemove.forEach((tc) => testsuite.removeChild(tc));

    // Add back only the latest execution of each test
    testMap.forEach((executions, testKey) => {
      if (executions.length === 1) {
        // No retries, keep as is
        testsuite.appendChild(executions[0].element);
      } else {
        // Multiple executions found - this is a retry scenario
        // Always keep the LATEST execution (highest execution order)
        const latestExecution = executions.reduce((latest, current) =>
          current.executionOrder > latest.executionOrder ? current : latest,
        );

        // Preserve all data from the latest execution including system-out, system-err, etc.
        testsuite.appendChild(latestExecution.element);

        const statusSummary = executions.map((e) => e.status).join(" → ");
        console.log(
          `🔄 Merged test "${testKey}": ${executions.length} executions (${statusSummary}) → keeping latest: ${latestExecution.status}`,
        );
      }
    });
  }

  private getTestStatus(
    testcase: Element,
  ): "passed" | "failed" | "skipped" | "error" {
    // Check for failure
    if (testcase.getElementsByTagName("failure").length > 0) {
      return "failed";
    }

    // Check for error
    if (testcase.getElementsByTagName("error").length > 0) {
      return "error";
    }

    // Check for skipped
    if (testcase.getElementsByTagName("skipped").length > 0) {
      return "skipped";
    }

    // Default to passed
    return "passed";
  }

  private updateTestsuiteStats(doc: Document): void {
    const testsuites = doc.getElementsByTagName("testsuite");

    for (let i = 0; i < testsuites.length; i++) {
      const testsuite = testsuites[i];
      const testcases = testsuite.getElementsByTagName("testcase");

      let tests = 0;
      let failures = 0;
      let errors = 0;
      let skipped = 0;
      let totalTime = 0;

      for (let j = 0; j < testcases.length; j++) {
        const testcase = testcases[j];
        tests++;

        const time = parseFloat(testcase.getAttribute("time") || "0");
        totalTime += time;

        const status = this.getTestStatus(testcase);
        switch (status) {
          case "failed":
            failures++;
            break;
          case "error":
            errors++;
            break;
          case "skipped":
            skipped++;
            break;
        }
      }

      // Update attributes
      testsuite.setAttribute("tests", tests.toString());
      testsuite.setAttribute("failures", failures.toString());
      testsuite.setAttribute("errors", errors.toString());
      testsuite.setAttribute("skipped", skipped.toString());
      testsuite.setAttribute("time", totalTime.toFixed(3));
    }

    // Update the parent testsuites tag if it exists
    this.updateTestsuitesStats(doc);
  }

  private updateTestsuitesStats(doc: Document): void {
    const testsuitesElements = doc.getElementsByTagName("testsuites");
    if (testsuitesElements.length === 0) {
      return; // No testsuites tag found
    }

    const testsuites = testsuitesElements[0]; // Get the first testsuites element
    const testsuiteElements = doc.getElementsByTagName("testsuite");

    let totalTests = 0;
    let totalFailures = 0;
    let totalErrors = 0;
    let totalSkipped = 0;
    let totalTime = 0;

    // Aggregate statistics from all testsuite elements
    for (let i = 0; i < testsuiteElements.length; i++) {
      const testsuite = testsuiteElements[i];

      totalTests += parseInt(testsuite.getAttribute("tests") || "0", 10);
      totalFailures += parseInt(testsuite.getAttribute("failures") || "0", 10);
      totalErrors += parseInt(testsuite.getAttribute("errors") || "0", 10);
      totalSkipped += parseInt(testsuite.getAttribute("skipped") || "0", 10);

      const time = parseFloat(testsuite.getAttribute("time") || "0");
      totalTime += time;
    }

    // Update the testsuites element attributes
    testsuites.setAttribute("tests", totalTests.toString());
    testsuites.setAttribute("failures", totalFailures.toString());
    testsuites.setAttribute("errors", totalErrors.toString());
    testsuites.setAttribute("skipped", totalSkipped.toString());
    testsuites.setAttribute("time", totalTime.toFixed(3));

    console.log(
      `📊 Updated testsuites stats: ${totalTests} tests, ${totalFailures} failures, ${totalErrors} errors, ${totalSkipped} skipped`,
    );
  }

  private formatXml(xml: string): string {
    // Basic XML formatting - adds proper declaration if missing
    if (!xml.startsWith("<?xml")) {
      xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
    }
    return xml;
  }
}

// Example usage and CLI interface
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: npx tsx junit-merger.ts <input-file> [output-file]

Examples:
  npx tsx junit-merger.ts test-results.xml
  npx tsx junit-merger.ts test-results.xml merged-results.xml

This script will:
1. Parse the JUnit XML file
2. Group tests by name and classname
3. Keep only the latest execution result for each test
4. Update testsuite statistics accordingly
`);
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const merger = new JUnitMerger();
  merger.mergeRetriedTests(inputFile, outputFile);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { JUnitMerger };
