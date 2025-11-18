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
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
      ],
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
            waitUntil: "domcontentloaded",
            timeout: 30000,
          }
        );

        await delay(2000);

        // Step 2: Find and fill the phone number input
        console.log("⌨️ Looking for phone input field...");
        let inputField =
          (await page.$("#identify_email")) ||
          (await page.$('input[name="email"]'));

        if (!inputField) {
          throw new Error("❌ Could not find phone input field");
        }

        await inputField.click({ clickCount: 3 });
        await inputField.type(phoneNumber, { delay: 50 });
        console.log("✅ Phone number entered");

        await delay(1000);

        // Step 3: Click search button
        console.log("🔎 Looking for search button...");
        const searchButton =
          (await page.$('button[type="submit"]')) ||
          (await page.$('input[type="submit"]'));

        if (searchButton) {
          await searchButton.click();
          console.log("✅ Clicked search button");
        } else {
          await page.keyboard.press("Enter");
          console.log("✅ Pressed Enter key");
        }

        // Wait for navigation
        await delay(5000);

        // Step 4: Check current URL
        const currentUrl = page.url();
        console.log(`📍 Current URL: ${currentUrl}`);

        let exists = false;
        let otpSent = false;
        let finalUrl = currentUrl;

        // Check if we're on OTP method selection page (account exists)
        if (currentUrl.includes("/recover/initiate")) {
          console.log("✅ Account found! Directly on OTP method page");
          exists = true;

          try {
            // Step 5: Select SMS method
            console.log("📲 Selecting SMS option...");
            await delay(2000);

            const smsRadioButton = await page.$('input[id^="send_sms"]');
            if (smsRadioButton) {
              await smsRadioButton.click();
              console.log("✅ Selected SMS via radio button ID");
            } else {
              // Fallback selectors
              const smsSelectors = [
                'input[value="1"]',
                'input[value="sms"]',
                'input[name="recover_method"][value="1"]',
              ];

              let smsSelected = false;
              for (const selector of smsSelectors) {
                try {
                  const element = await page.$(selector);
                  if (element) {
                    await element.click();
                    console.log(`✅ Selected SMS: ${selector}`);
                    smsSelected = true;
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }
            }

            await delay(2000);

            // Step 6: Click continue button
            console.log("➡️ Looking for continue button...");
            await delay(1000);

            const continueButton = await page.$(
              'button._42ft._4jy0._9nq0.textPadding20px._4jy3._4jy1.selected._51sy[name="reset_action"]'
            );

            if (continueButton) {
              await continueButton.click();
              console.log("✅ Clicked continue button");

              await delay(5000);

              finalUrl = page.url();
              console.log(`📍 New URL after continue: ${finalUrl}`);

              if (
                finalUrl.includes("/recover/code") ||
                finalUrl.includes("code=")
              ) {
                otpSent = true;
                console.log(
                  "🎉 OTP sent successfully! Confirmed on code entry page."
                );
              } else {
                console.log("⚠️ OTP may not have been sent");
                otpSent = false;
              }
            }
          } catch (otpError) {
            console.log("⚠️ OTP flow error:", otpError.message);
          }
        }
        // Direct OTP code page
        else if (
          currentUrl.includes("/recover/code") ||
          currentUrl.includes("code=")
        ) {
          console.log("🎉 Account found and OTP already sent!");
          exists = true;
          otpSent = true;
          finalUrl = currentUrl;
        }
        // Multiple accounts page
        else if (currentUrl.includes("ctx=not_my_account")) {
          console.log("✅ Account found! Multiple accounts detected");
          exists = true;
        } else {
          console.log("❌ No account found");
          exists = false;
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

      // Navigate back for next number
      if (i < phoneNumbers.length - 1) {
        console.log("🔄 Returning to start page for next number...");
        await page.goto(
          "https://www.facebook.com/login/identify/?ctx=recover&from_login_screen=0",
          { waitUntil: "domcontentloaded" }
        );
        await delay(2000);
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
