// controllers/fbAutomatOtpController.js
import puppeteer from "puppeteer";

// Helper function for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fbAutomatOtpController = async (req, res) => {
  console.log("🚀 Facebook account check started...");

  const { phoneNumbers } = req.body;

  if (!phoneNumbers || !Array.isArray(phoneNumbers)) {
    return res.status(400).json({ message: "Phone numbers array is required" });
  }

  console.log(`📱 Processing ${phoneNumbers.length} phone numbers`);

  let browser;
  try {
    const launchOptions = {
      headless: "new",
      executablePath: process.env.CHROME_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--window-size=1200,800",
      ],
      defaultViewport: null,
    };

    console.log(`🔧 Launching puppeteer in ${process.env.NODE_ENV} mode...`);

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Block images, stylesheets, fonts to improve performance
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "stylesheet", "font"].includes(req.resourceType())) {
        req.abort().catch(() => {});
      } else {
        req.continue().catch(() => {});
      }
    });

    const results = [];
    let processedCount = 0;

    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      processedCount++;
      console.log(
        `\n🔍 === Processing number ${i + 1}/${
          phoneNumbers.length
        }: ${phoneNumber} ===`
      );

      try {
        // Step 1: Go to Facebook recovery page
        console.log("🌐 Navigating to Facebook recovery page...");
        await page.goto(
          "https://www.facebook.com/login/identify/?ctx=recover&from_login_screen=0",
          {
            waitUntil: "networkidle2",
            timeout: 60000,
          }
        );

        // Step 2: Find and fill the phone number input
        console.log("⌨️ Looking for phone input field...");

        const inputSelectors = [
          "#identify_email",
          'input[name="email"]',
          'input[type="text"]',
          'input[placeholder*="email" i]',
          'input[placeholder*="phone" i]',
          'input[placeholder*="mobile" i]',
          "input#identify_email",
          'input[name="identify_email"]',
          ".uiInputLabelInput input",
        ];

        let inputField = null;
        for (const selector of inputSelectors) {
          inputField = await page.$(selector);
          if (inputField) {
            console.log(`✅ Found input field with selector: ${selector}`);
            break;
          }
        }

        if (!inputField) {
          throw new Error("❌ Could not find phone input field");
        }

        // Clear and type phone number
        await inputField.click({ clickCount: 3 });
        await page.keyboard.press("Backspace");
        await inputField.type(phoneNumber, { delay: 100 });
        console.log("✅ Phone number entered");

        // Step 3: Click search button
        console.log("🔎 Looking for search button...");

        const buttonSelectors = [
          'button[type="submit"]',
          'input[type="submit"]',
          'button[value="search"]',
          'button:contains("Search")',
          'input[value="Search"]',
          "button#search",
          "button._42ft._4jy0._9nq0",
          'button[data-testid*="search"]',
        ];

        let searchButton = null;
        for (const selector of buttonSelectors) {
          try {
            if (selector.includes("contains")) {
              searchButton = await page.$x(`//button[contains(., 'Search')]`);
              if (searchButton && searchButton.length > 0) {
                searchButton = searchButton[0];
                console.log(`✅ Found button with text: Search`);
                break;
              }
            } else {
              searchButton = await page.$(selector);
              if (searchButton) {
                console.log(`✅ Found button with selector: ${selector}`);
                break;
              }
            }
          } catch (e) {
            continue;
          }
        }

        if (searchButton) {
          await searchButton.click();
          console.log("✅ Clicked search button");
        } else {
          console.log("⚠️ No button found, pressing Enter");
          await page.keyboard.press("Enter");
        }

        // Wait for navigation
        console.log("⏳ Waiting for page response...");
        await delay(8000);

        // Check for various response scenarios
        const currentUrl = page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        let exists = false;

        // IMPROVED Account detection logic - CHECK FOR NO RESULTS FIRST
        console.log("🔍 Performing account detection checks...");

        // FIRST: Check for explicit "no account" indicators
        const noAccountIndicators = await page.evaluate(() => {
          // Check for "No search results" text
          const noResultsText =
            document.body.innerText.includes("No search results") ||
            document.body.innerText.includes("couldn't find") ||
            document.body.innerText.includes("no account") ||
            document.body.innerText.includes("No account found");

          // Check for error messages in the DOM
          const errorElements = document.querySelectorAll(
            '[class*="error"], [class*="notice"], [class*="message"]'
          );
          let hasError = false;
          errorElements.forEach((el) => {
            const text = el.innerText.toLowerCase();
            if (
              text.includes("no search") ||
              text.includes("couldn't find") ||
              text.includes("no account")
            ) {
              hasError = true;
            }
          });

          return noResultsText || hasError;
        });

        if (noAccountIndicators) {
          console.log(
            "❌ No account found - explicit 'no results' message detected"
          );
          exists = false;
        }
        // THEN: Check for account existence only if no "no account" indicators found
        else if (currentUrl.includes("/recover/initiate")) {
          console.log("✅ Account found! On OTP method selection page");
          exists = true;
        } else if (
          currentUrl.includes("/recover/code") ||
          currentUrl.includes("code=")
        ) {
          console.log("✅ Account found! On OTP code page");
          exists = true;
        } else if (
          currentUrl.includes("ctx=not_my_account") ||
          currentUrl.includes("multiple")
        ) {
          console.log("✅ Account found! Multiple accounts detected");
          exists = true;
        } else if (currentUrl.includes("no_email")) {
          console.log(
            "❌ No account found (Facebook explicit no account page)"
          );
          exists = false;
        } else {
          // Additional checks for account existence
          console.log("🔍 Performing additional account detection checks...");

          // Check for presence of recovery options (indicating account exists)
          const recoveryElements = await page.$$(
            [
              'input[name="recover_method"]',
              'input[type="radio"]',
              'button[value="continue"]',
              'a[href*="recover"]',
            ].join(",")
          );

          if (recoveryElements.length > 0) {
            console.log(
              `✅ Account found! Detected ${recoveryElements.length} recovery elements`
            );
            exists = true;
          } else {
            // Check page content for indicators
            const pageContent = await page.content();
            const accountIndicators = [
              /send code/i,
              /recovery method/i,
              /get code/i,
              /continue/i,
              /reset password/i,
            ];

            const hasAccountIndicators = accountIndicators.some((pattern) =>
              pattern.test(pageContent)
            );

            if (hasAccountIndicators) {
              console.log(
                "✅ Account found! Detected recovery indicators in page content"
              );
              exists = true;
            } else {
              console.log(
                "❌ No account found - no recovery indicators detected"
              );
              exists = false;
            }
          }
        }

        // Create result object
        const resultObj = {
          phone: phoneNumber,
          exists,
          timestamp: new Date().toISOString(),
          status: exists ? "account_found" : "no_account",
        };

        results.push(resultObj);

        console.log(
          `📊 Result: ${exists ? "✅ Account Found" : "❌ No Account"}`
        );
      } catch (error) {
        console.error(`💥 Error processing ${phoneNumber}:`, error.message);

        const errorResult = {
          phone: phoneNumber,
          exists: false,
          error: true,
          errorMessage: error.message,
          timestamp: new Date().toISOString(),
          status: "error",
        };

        results.push(errorResult);
      }

      // Navigate back for next number
      if (i < phoneNumbers.length - 1) {
        console.log("🔄 Returning to start page for next number...");
        await page.goto(
          "https://www.facebook.com/login/identify/?ctx=recover&from_login_screen=0",
          { waitUntil: "networkidle2", timeout: 30000 }
        );
      }
    }

    // Calculate summary
    const accountsFound = results.filter((r) => r.exists && !r.error).length;

    console.log(`\n🎊 Account check completed!`);
    console.log(`📈 Summary: Processed ${phoneNumbers.length} numbers`);

    res.status(200).json({
      success: true,
      results,
      summary: {
        totalProcessed: phoneNumbers.length,
        accountsFound,
        errors: results.filter((r) => r.error).length,
      },
      message: `Processed ${phoneNumbers.length} numbers, found ${accountsFound} accounts`,
    });
  } catch (error) {
    console.error("💀 Main automation error:", error);
    res.status(500).json({
      success: false,
      message: "Automation failed",
      error: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
      console.log("🔚 Browser closed");
    }
  }
};
