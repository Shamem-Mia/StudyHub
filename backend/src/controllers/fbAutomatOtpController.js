// controllers/fbAutomatOtpController.js
import puppeteer from "puppeteer";
import FacebookResult from "../models/fbAccAndOtpCheck.js";

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
    const launchOptions = {
      headless: "new", // Set to false for debugging, then change back to "new"
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
        req.abort();
      } else {
        req.continue();
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

        await delay(3000);

        // Step 2: Find and fill the phone number input - IMPROVED SELECTORS
        console.log("⌨️ Looking for phone input field...");

        // Try multiple possible selectors for the input field
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
          // Take screenshot for debugging
          await page.screenshot({ path: `debug-no-input-${i}.png` });
          throw new Error("❌ Could not find phone input field");
        }

        // Clear and type phone number
        await inputField.click({ clickCount: 3 });
        await page.keyboard.press("Backspace");
        await inputField.type(phoneNumber, { delay: 100 });
        console.log("✅ Phone number entered");

        await delay(2000);

        // Step 3: Click search button - IMPROVED BUTTON SELECTORS
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
          'button:has-text("Search")',
        ];

        let searchButton = null;
        for (const selector of buttonSelectors) {
          try {
            if (
              selector.includes("contains") ||
              selector.includes("has-text")
            ) {
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

        // Wait for navigation with better timeout
        console.log("⏳ Waiting for page response...");
        await delay(8000);

        // Check for various response scenarios
        const currentUrl = page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        let exists = false;
        let otpSent = false;
        let finalUrl = currentUrl;

        // IMPROVED ACCOUNT DETECTION LOGIC
        if (currentUrl.includes("/recover/initiate")) {
          console.log("✅ Account found! On OTP method selection page");
          exists = true;

          // Take screenshot for verification
          await page.screenshot({ path: `debug-account-found-${i}.png` });

          // Try to detect if we're actually on the right page by checking for method options
          const methodOptions = await page.$$(
            'input[name="recover_method"], input[type="radio"]'
          );
          if (methodOptions.length > 0) {
            console.log(
              `✅ Confirmed: Found ${methodOptions.length} recovery methods`
            );
          }
        } else if (
          currentUrl.includes("/recover/code") ||
          currentUrl.includes("code=")
        ) {
          console.log("🎉 Account found and OTP already sent!");
          exists = true;
          otpSent = true;
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

          // Check for error messages indicating no account
          const noAccountSelectors = [
            'div:contains("No search results")',
            'div:contains("couldn\'t find")',
            'div:contains("no account")',
            'div[class*="error"]',
            'div[class*="notice"]',
          ];

          let noAccountFound = false;
          for (const selector of noAccountSelectors) {
            try {
              const element = await page.$x(
                `//*[contains(text(), 'No search results')]`
              );
              if (element && element.length > 0) {
                noAccountFound = true;
                console.log("❌ Explicit 'no account' message found");
                break;
              }
            } catch (e) {
              continue;
            }
          }

          // Check for presence of recovery options (indicating account exists)
          const recoveryElements = await page.$$(
            [
              'input[name="recover_method"]',
              'input[type="radio"]',
              'button[value="continue"]',
              'a[href*="recover"]',
            ].join(",")
          );

          if (recoveryElements.length > 0 && !noAccountFound) {
            console.log(
              `✅ Account found! Detected ${recoveryElements.length} recovery elements`
            );
            exists = true;
          } else if (!noAccountFound) {
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
          } else {
            exists = false;
          }
        }

        // OTP SENDING LOGIC - ONLY IF ACCOUNT EXISTS
        if (exists) {
          console.log("🔄 Attempting OTP sending flow...");

          if (currentUrl.includes("/recover/initiate")) {
            try {
              // Step 5: Select SMS method - IMPROVED SELECTORS
              console.log("📲 Selecting SMS option...");
              await delay(3000);

              const smsSelectors = [
                'input[id*="send_sms"]',
                'input[value="1"]',
                'input[value="sms"]',
                'input[name="recover_method"][value="1"]',
                'input[type="radio"]:nth-of-type(1)',
                'label:contains("Text") input',
                'label:has-text("SMS") input',
              ];

              let smsSelected = false;
              for (const selector of smsSelectors) {
                try {
                  if (
                    selector.includes("contains") ||
                    selector.includes("has-text")
                  ) {
                    const smsElement = await page.$x(
                      `//label[contains(., 'Text')]//input`
                    );
                    if (smsElement && smsElement.length > 0) {
                      await smsElement[0].click();
                      console.log("✅ Selected SMS via text label");
                      smsSelected = true;
                      break;
                    }
                  } else {
                    const element = await page.$(selector);
                    if (element) {
                      await element.click();
                      console.log(`✅ Selected SMS: ${selector}`);
                      smsSelected = true;
                      break;
                    }
                  }
                } catch (e) {
                  continue;
                }
              }

              if (!smsSelected) {
                console.log(
                  "⚠️ Could not find SMS option, trying first radio button"
                );
                const firstRadio = await page.$('input[type="radio"]');
                if (firstRadio) {
                  await firstRadio.click();
                  console.log("✅ Selected first radio button as fallback");
                }
              }

              await delay(3000);

              // Step 6: Click continue button - IMPROVED SELECTORS
              console.log("➡️ Looking for continue button...");

              const continueSelectors = [
                'button[name="reset_action"]',
                'input[type="submit"]',
                'button[type="submit"]',
                'button:contains("Continue")',
                'input[value="Continue"]',
                "button._42ft._4jy0._9nq0",
                'button[data-testid*="continue"]',
              ];

              let continueButton = null;
              for (const selector of continueSelectors) {
                try {
                  if (selector.includes("contains")) {
                    continueButton = await page.$x(
                      `//button[contains(., 'Continue')]`
                    );
                    if (continueButton && continueButton.length > 0) {
                      continueButton = continueButton[0];
                      break;
                    }
                  } else {
                    continueButton = await page.$(selector);
                    if (continueButton) break;
                  }
                } catch (e) {
                  continue;
                }
              }

              if (continueButton) {
                await continueButton.click();
                console.log("✅ Clicked continue button");

                // Wait for OTP page
                await delay(8000);

                finalUrl = page.url();
                console.log(`📍 New URL after continue: ${finalUrl}`);

                // Check if OTP was successfully sent
                if (
                  finalUrl.includes("/recover/code") ||
                  finalUrl.includes("code=")
                ) {
                  otpSent = true;
                  console.log("🎉 OTP sent successfully!");
                } else {
                  // Check for OTP success indicators on page
                  const pageText = await page.content();
                  if (
                    pageText.includes("code sent") ||
                    pageText.includes("sent to")
                  ) {
                    otpSent = true;
                    console.log(
                      "🎉 OTP sent successfully (detected in page content)!"
                    );
                  } else {
                    console.log("⚠️ OTP may not have been sent");
                    otpSent = false;
                  }
                }
              } else {
                console.log("❌ Continue button not found");
              }
            } catch (otpError) {
              console.log("⚠️ OTP flow error:", otpError.message);
              // Take screenshot for debugging
              await page.screenshot({ path: `debug-otp-error-${i}.png` });
            }
          } else if (
            currentUrl.includes("/recover/code") ||
            currentUrl.includes("code=")
          ) {
            otpSent = true;
            console.log("✅ OTP already sent (direct to code page)");
          }
        }

        // Determine status
        let status = "no_account";
        if (exists && otpSent) {
          status = "account_found_otp_sent";
        } else if (exists && !otpSent) {
          status = "account_found_otp_not_sent";
        }

        // Create result object
        const resultObj = {
          phone: phoneNumber,
          exists,
          otpSent,
          timestamp: new Date().toISOString(),
          url: finalUrl,
          status,
          processedCount: processedCount,
        };

        results.push(resultObj);

        // Store in MongoDB
        try {
          const dbRecord = new FacebookResult({
            phoneNumber: phoneNumber,
            accountExists: exists,
            otpSent: otpSent,
            status: status,
            finalUrl: finalUrl,
            error: false,
            errorMessage: null,
            processedOrder: processedCount,
          });

          await dbRecord.save();
          console.log(
            `💾 Saved to MongoDB: ${phoneNumber} - Status: ${status}`
          );
        } catch (dbError) {
          console.error(`❌ MongoDB save error:`, dbError.message);
        }

        console.log(
          `📊 Result: ${exists ? "✅ Account" : "❌ No Account"} | OTP: ${
            otpSent ? "✅ Sent" : "❌ Not Sent"
          }`
        );
      } catch (error) {
        console.error(`💥 Error processing ${phoneNumber}:`, error.message);

        const errorResult = {
          phone: phoneNumber,
          exists: false,
          otpSent: false,
          error: true,
          errorMessage: error.message,
          timestamp: new Date().toISOString(),
          status: "no_account",
          processedCount: processedCount,
        };

        results.push(errorResult);

        // Store error in MongoDB
        try {
          const dbRecord = new FacebookResult({
            phoneNumber: phoneNumber,
            accountExists: false,
            otpSent: false,
            status: "no_account",
            finalUrl: null,
            error: true,
            errorMessage: error.message,
            processedOrder: processedCount,
          });

          await dbRecord.save();
        } catch (dbError) {
          console.error(`❌ MongoDB error save failed:`, dbError.message);
        }
      }

      // Navigate back for next number with longer delay
      if (i < phoneNumbers.length - 1) {
        console.log("🔄 Returning to start page for next number...");
        await page.goto(
          "https://www.facebook.com/login/identify/?ctx=recover&from_login_screen=0",
          { waitUntil: "networkidle2", timeout: 30000 }
        );
        await delay(3000);
      }
    }

    // Calculate summary
    const accountsFound = results.filter((r) => r.exists && !r.error).length;
    const otpsSent = results.filter((r) => r.otpSent).length;
    const accountsFoundButNoOtp = results.filter(
      (r) => r.exists && !r.otpSent && !r.error
    ).length;

    console.log(`\n🎊 Automation completed!`);
    console.log(`📈 Summary: Processed ${phoneNumbers.length} numbers`);

    res.status(200).json({
      success: true,
      results,
      summary: {
        totalProcessed: phoneNumbers.length,
        accountsFound,
        otpsSent,
        accountsFoundButNoOtp,
        errors: results.filter((r) => r.error).length,
        processedCount: processedCount,
      },
      message: `Processed ${phoneNumbers.length} numbers, found ${accountsFound} accounts, sent ${otpsSent} OTPs`,
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
