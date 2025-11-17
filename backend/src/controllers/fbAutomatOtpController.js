// controllers/fbAutomatOtpController.js
import puppeteer from "puppeteer";

// Helper function for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fbAutomatOtpController = async (req, res) => {
  console.log("🚀 Facebook OTP automation started...");

  const { phoneNumbers } = req.body;

  if (!phoneNumbers || !Array.isArray(phoneNumbers)) {
    return res.status(400).json({ message: "Phone numbers array is required" });
  }

  console.log(`📱 Processing ${phoneNumbers.length} phone numbers`);

  let browser;

  try {
    // Production-ready Puppeteer configuration
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--window-size=1920,1080",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium-browser"
          : undefined,
      defaultViewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Set extra headers to appear more human
    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    });

    // Block unnecessary resources for better performance
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const results = [];

    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      console.log(
        `\n🔍 Processing ${i + 1}/${phoneNumbers.length}: ${phoneNumber}`
      );

      try {
        // Step 1: Go to Facebook recovery page with better error handling
        console.log("🌐 Navigating to Facebook recovery page...");
        try {
          await page.goto(
            "https://www.facebook.com/login/identify/?ctx=recover&from_login_screen=0",
            {
              waitUntil: "networkidle2",
              timeout: 60000,
            }
          );
        } catch (navError) {
          console.log("⚠️ Navigation timeout, trying with domcontentloaded...");
          await page.goto(
            "https://www.facebook.com/login/identify/?ctx=recover&from_login_screen=0",
            {
              waitUntil: "domcontentloaded",
              timeout: 30000,
            }
          );
        }

        await delay(3000);

        // Step 2: Find and fill the phone number input with better selectors
        console.log("⌨️ Looking for phone input field...");

        // Try multiple selectors for the input field
        const inputSelectors = [
          "#identify_email",
          'input[name="email"]',
          'input[type="text"]',
          'input[placeholder*="email" i]',
          'input[placeholder*="phone" i]',
          'input[placeholder*="mobile" i]',
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
          // Take screenshot for debugging
          await page.screenshot({
            path: `/tmp/debug-no-input-${Date.now()}.png`,
          });
          throw new Error("❌ Could not find phone input field");
        }

        await inputField.click({ clickCount: 3 });
        await inputField.type(phoneNumber, { delay: 100 });
        console.log("✅ Phone number entered");

        await delay(2000);

        // Step 3: Click search button with better error handling
        console.log("🔎 Looking for search button...");

        const searchSelectors = [
          'button[type="submit"]',
          'input[type="submit"]',
          'button:contains("Search")',
          'button:contains("Find")',
          'input[value="Search"]',
          'input[value="Find"]',
        ];

        let searchClicked = false;
        for (const selector of searchSelectors) {
          try {
            const searchButton = await page.$(selector);
            if (searchButton) {
              await searchButton.click();
              console.log(`✅ Clicked search button: ${selector}`);
              searchClicked = true;
              break;
            }
          } catch (e) {
            continue;
          }
        }

        if (!searchClicked) {
          console.log("⚠️ No search button found, pressing Enter...");
          await page.keyboard.press("Enter");
        }

        // Wait for navigation with better timeout handling
        await delay(8000);

        // Step 4: Check current URL
        const currentUrl = page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        let exists = false;
        let otpSent = false;
        let finalUrl = currentUrl;

        // Check various Facebook response patterns
        if (currentUrl.includes("/recover/initiate")) {
          console.log("✅ Account found! On OTP method page");
          exists = true;

          // ... rest of your OTP logic remains the same ...
          // Continue with your existing OTP sending logic
        } else if (currentUrl.includes("/recover/code")) {
          console.log("🎉 Account found and OTP already sent!");
          exists = true;
          otpSent = true;
        } else if (currentUrl.includes("checkpoint")) {
          console.log(
            "⚠️ Facebook checkpoint detected - account exists but requires verification"
          );
          exists = true;
        } else if (currentUrl.includes("no_email")) {
          console.log("❌ No account found with this number");
          exists = false;
        } else {
          console.log("❌ No account found or unexpected page");
          exists = false;
        }

        // Create result
        const resultObj = {
          phone: phoneNumber,
          exists,
          otpSent,
          timestamp: new Date().toISOString(),
          url: currentUrl,
        };

        results.push(resultObj);

        console.log(
          `📊 Result: ${exists ? "✅ Account" : "❌ No Account"} | OTP: ${
            otpSent ? "✅ Sent" : "❌ Not Sent"
          }`
        );

        // Navigate back for next number with error handling
        if (i < phoneNumbers.length - 1) {
          console.log("🔄 Returning to start page...");
          try {
            await page.goto(
              "https://www.facebook.com/login/identify/?ctx=recover&from_login_screen=0",
              { waitUntil: "domcontentloaded", timeout: 30000 }
            );
            await delay(3000);
          } catch (error) {
            console.log("⚠️ Navigation back failed, continuing...");
          }
        }
      } catch (error) {
        console.error(`💥 Error processing ${phoneNumber}:`, error.message);
        results.push({
          phone: phoneNumber,
          exists: false,
          otpSent: false,
          error: true,
          errorMessage: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Calculate summary
    const accountsFound = results.filter((r) => r.exists && !r.error).length;
    const otpsSent = results.filter((r) => r.otpSent).length;

    console.log(`\n🎊 Automation completed!`);
    console.log(`📈 Summary: Processed ${phoneNumbers.length} numbers`);

    res.status(200).json({
      success: true,
      results,
      summary: {
        totalProcessed: phoneNumbers.length,
        accountsFound,
        otpsSent,
        errors: results.filter((r) => r.error).length,
      },
      message: `Processed ${phoneNumbers.length} numbers, found ${accountsFound} accounts, sent ${otpsSent} OTPs`,
    });
  } catch (error) {
    console.error("💀 Main automation error:", error);

    // More detailed error information
    res.status(500).json({
      success: false,
      message: "Automation failed",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("🔚 Browser closed");
      } catch (closeError) {
        console.error("❌ Error closing browser:", closeError.message);
      }
    }
  }
};
