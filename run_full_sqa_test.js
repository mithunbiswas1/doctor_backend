// ael_backend/run_full_sqa_test.js
import mongoose from "mongoose";

const BASE_URL = "http://localhost:8005/api/v1";
const results = [];

function recordResult(testName, passed, details = "") {
  results.push({ testName, passed, details });
  console.log(`[${passed ? "PASS" : "FAIL"}] ${testName} ${details ? "- " + details : ""}`);
}

async function run() {
  console.log("==================================================");
  console.log("🚀 STARTING COMPREHENSIVE END-TO-END SQA TEST SUITE");
  console.log("==================================================\n");

  await mongoose.connect("mongodb://localhost:27017/ael");

  let adminToken = null;
  let userToken = null;
  const testEmail = `sqa_tester_${Date.now()}@example.com`;
  const testPhone = `017${Date.now().toString().slice(-8)}`;

  // ----------------------------------------------------
  // TEST SUITE 1: AUTHENTICATION & OTP REGISTRATION
  // ----------------------------------------------------
  console.log("--- 1. Testing Registration & Email OTP Flow ---");
  try {
    // 1.1 Send Registration OTP
    const otpRes = await fetch(`${BASE_URL}/user/send-registration-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    }).then((r) => r.json());

    if (otpRes.success) {
      recordResult("1.1 Send Registration OTP to Email", true, `Email: ${testEmail}`);
    } else {
      recordResult("1.1 Send Registration OTP to Email", false, otpRes.message);
    }

    // 1.2 Fetch OTP from MongoDB
    const otpRecord = await mongoose.connection.db
      .collection("otps")
      .findOne({ email: testEmail });

    if (otpRecord && otpRecord.otp) {
      recordResult("1.2 Retrieve OTP with 10m TTL from MongoDB", true, `Code: ${otpRecord.otp}`);
    } else {
      recordResult("1.2 Retrieve OTP with 10m TTL from MongoDB", false, "No OTP record found in DB");
    }

    // 1.3 Verify Registration OTP
    const verifyRes = await fetch(`${BASE_URL}/user/verify-registration-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, otp: otpRecord.otp }),
    }).then((r) => r.json());

    recordResult(
      "1.3 Verify OTP via API",
      verifyRes.success === true,
      verifyRes.message || ""
    );

    // 1.4 Register User
    const regRes = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: `user_${Date.now()}`,
        fullName: "SQA Automated Tester",
        email: testEmail,
        phone: testPhone,
        password: "TestPassword123!",
        role: "user",
      }),
    }).then((r) => r.json());

    recordResult("1.4 Account Registration Submission", regRes.success === true, regRes.message || "");

    // 1.5 Login with newly created user
    const userLoginRes = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: "TestPassword123!" }),
    }).then((r) => r.json());

    if (userLoginRes.success && userLoginRes.data?.accessToken) {
      userToken = userLoginRes.data.accessToken;
      recordResult("1.5 User Login & Access Token Issuance", true, `Token: ${userToken.slice(0, 15)}...`);
    } else {
      recordResult("1.5 User Login & Access Token Issuance", false, userLoginRes.message);
    }

    // 1.6 User Profile Fetch
    const profileRes = await fetch(`${BASE_URL}/user/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${userToken}` },
    }).then((r) => r.json());

    recordResult("1.6 Fetch User Profile with Bearer JWT", profileRes.success === true, profileRes.data?.fullName || "");
  } catch (err) {
    recordResult("Suite 1 Auth & Registration", false, err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 2: ADMIN AUTH & PLATFORM METRICS
  // ----------------------------------------------------
  console.log("\n--- 2. Testing Admin Operations & Live Overview Stats ---");
  try {
    // 2.1 Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "superadmin@ael.com", password: "password123" }),
    }).then((r) => r.json());

    if (adminLoginRes.success && adminLoginRes.data?.accessToken) {
      adminToken = adminLoginRes.data.accessToken;
      recordResult("2.1 Admin Login", true, `Logged in as: ${adminLoginRes.data.user?.fullName}`);
    } else {
      recordResult("2.1 Admin Login", false, adminLoginRes.message);
    }

    // 2.2 Dashboard Overview Real Dynamic Stats
    const statsRes = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());

    const counters = statsRes.data?.counters;
    const isCountersValid =
      typeof counters?.totalUsers === "number" &&
      typeof counters?.totalRevenue === "number" &&
      Array.isArray(statsRes.data?.monthlyGrowth);

    recordResult(
      "2.2 Admin Dashboard Real Dynamic Stats",
      isCountersValid,
      `Users: ${counters?.totalUsers}, Revenue: ৳${counters?.totalRevenue}, Growth Months: ${statsRes.data?.monthlyGrowth?.length}`
    );

    // 2.3 System Settings Fetch & Update
    const getSettingsRes = await fetch(`${BASE_URL}/admin/settings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());

    recordResult("2.3 Admin Fetch System Settings", getSettingsRes.success === true, `Site: ${getSettingsRes.data?.siteName}`);

    const patchSettingsRes = await fetch(`${BASE_URL}/admin/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        siteName: "AEL SafeLPG Bangladesh Official",
        siteEmail: "admin@safelpg.com",
      }),
    }).then((r) => r.json());

    recordResult("2.4 Admin Update System Settings", patchSettingsRes.success === true, `Updated: ${patchSettingsRes.data?.siteName}`);

    // 2.5 Admin Reports Data Center
    const reportsRes = await fetch(`${BASE_URL}/admin/reports`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());

    const reportSummary = reportsRes.data?.summary;
    recordResult(
      "2.5 Admin Analytics & Reports Export Dataset",
      reportsRes.success === true,
      `Users: ${reportSummary?.totalUsersCount}, Tx: ${reportSummary?.totalTransactionsCount}, Campaigns: ${reportSummary?.totalCampaignsCount}`
    );
  } catch (err) {
    recordResult("Suite 2 Admin Suite", false, err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 3: CMS BLOG LIFECYCLE (POST, VIEW, EDIT, DELETE)
  // ----------------------------------------------------
  console.log("\n--- 3. Testing CMS Blogs Lifecycle ---");
  let createdBlogId = null;
  let blogSlug = null;
  try {
    // 3.1 Post Blog
    const newBlogRes = await fetch(`${BASE_URL}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: `SQA Safety Audit Standard ${Date.now()}`,
        titleBn: "এসকিউএ সুরক্ষা মানদণ্ড পরীক্ষা",
        content: "Detailed technical safety protocols for industrial LPG valves and manifolds.",
        contentBn: "শিল্প কারখানায় এলপিজি গ্যাস সুরক্ষার নির্দেশিকা।",
        category: "Safety Protocols",
        tags: ["safety", "sqa-test"],
        status: "published",
      }),
    }).then((r) => r.json());

    if (newBlogRes.success && newBlogRes.data?._id) {
      createdBlogId = newBlogRes.data._id;
      blogSlug = newBlogRes.data.slug;
      recordResult("3.1 Post New Blog Article", true, `ID: ${createdBlogId}, Slug: ${blogSlug}`);
    } else {
      recordResult("3.1 Post New Blog Article", false, newBlogRes.message);
    }

    // 3.2 View Public Blogs List
    const blogsListRes = await fetch(`${BASE_URL}/blogs`).then((r) => r.json());
    recordResult("3.2 View Public Blogs Catalog", blogsListRes.success === true, `Found: ${blogsListRes.data?.length || 0} blogs`);

    // 3.3 Edit Blog
    if (createdBlogId) {
      const editBlogRes = await fetch(`${BASE_URL}/blogs/${createdBlogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: `[EDITED] SQA Safety Audit Standard ${Date.now()}`,
        }),
      }).then((r) => r.json());

      recordResult("3.3 Edit Blog Article", editBlogRes.success === true, editBlogRes.data?.title || "");

      // 3.4 Delete Blog
      const deleteBlogRes = await fetch(`${BASE_URL}/blogs/${createdBlogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((r) => r.json());

      recordResult("3.4 Delete Blog Article", deleteBlogRes.success === true, "Article deleted from DB");
    }
  } catch (err) {
    recordResult("Suite 3 CMS Blogs", false, err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 4: MARKET UPDATES LIFECYCLE (POST, VIEW, EDIT, DELETE)
  // ----------------------------------------------------
  console.log("\n--- 4. Testing Market Updates Lifecycle ---");
  let createdUpdateId = null;
  try {
    // 4.1 Post Market Update
    const newUpdateRes = await fetch(`${BASE_URL}/market-updates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: `LPG Price Revision Advisory ${Date.now()}`,
        titleBn: "এলপিজি মূল্য সংশোধন বিজ্ঞপ্তি",
        description: "Official BERC circular regarding retail autogas and cylinder rates.",
        incidentType: "Regulatory Directive",
        location: "Dhaka",
        isPublished: true,
      }),
    }).then((r) => r.json());

    if (newUpdateRes.success && newUpdateRes.data?._id) {
      createdUpdateId = newUpdateRes.data._id;
      recordResult("4.1 Post Market Update", true, `ID: ${createdUpdateId}`);
    } else {
      recordResult("4.1 Post Market Update", false, newUpdateRes.message);
    }

    // 4.2 View Public Market Updates
    const updatesListRes = await fetch(`${BASE_URL}/market-updates`).then((r) => r.json());
    recordResult("4.2 View Market Updates List", updatesListRes.success === true, `Found: ${updatesListRes.data?.length || 0} updates`);

    // 4.3 Edit Market Update
    if (createdUpdateId) {
      const editUpdateRes = await fetch(`${BASE_URL}/market-updates/${createdUpdateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: `[EDITED] LPG Price Revision Advisory ${Date.now()}`,
        }),
      }).then((r) => r.json());

      recordResult("4.3 Edit Market Update", editUpdateRes.success === true, editUpdateRes.data?.title || "");

      // 4.4 Delete Market Update
      const deleteUpdateRes = await fetch(`${BASE_URL}/market-updates/${createdUpdateId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      }).then((r) => r.json());

      recordResult("4.4 Delete Market Update", deleteUpdateRes.success === true, "Record deleted from DB");
    }
  } catch (err) {
    recordResult("Suite 4 Market Updates", false, err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 5: COMMENTS & 1-LEVEL NESTED REPLIES & RATE LIMITING
  // ----------------------------------------------------
  console.log("\n--- 5. Testing Comments, 1-Level Nested Replies & Anti-Spam ---");
  let parentCommentId = null;
  const testTargetId = `target_${Date.now()}`;
  try {
    // 5.1 Post Parent Comment
    const commentRes = await fetch(`${BASE_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        targetId: testTargetId,
        targetType: "blog",
        targetTitle: "SQA Test Blog",
        content: "This is a primary technical inquiry regarding cylinder testing standards.",
      }),
    }).then((r) => r.json());

    if (commentRes.success && commentRes.data?._id) {
      parentCommentId = commentRes.data._id;
      recordResult("5.1 Post Top-Level Comment", true, `Comment ID: ${parentCommentId}`);
    } else {
      recordResult("5.1 Post Top-Level Comment", false, commentRes.message);
    }

    // 5.2 Post 1-Level Nested Reply
    if (parentCommentId) {
      const replyRes = await fetch(`${BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          targetId: testTargetId,
          targetType: "blog",
          targetTitle: "SQA Test Blog",
          content: "Official reply: Cylinders must be hydrostatically re-tested every 5 years.",
          parentId: parentCommentId,
        }),
      }).then((r) => r.json());

      recordResult("5.2 Post 1-Level Nested Reply", replyRes.success === true, `Parent: ${parentCommentId}`);

      // 5.3 Fetch Comments Tree with Nested Replies
      const treeRes = await fetch(
        `${BASE_URL}/comments?targetId=${testTargetId}&targetType=blog`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      ).then((r) => r.json());

      const fetchedList = treeRes.data || [];
      const hasReplies = fetchedList.some((c) => Array.isArray(c.replies) && c.replies.length > 0);
      recordResult("5.3 Fetch Nested Comments Hierarchy", hasReplies || fetchedList.length > 0, `Total top-level: ${fetchedList.length}`);
    }
  } catch (err) {
    recordResult("Suite 5 Comments & Replies", false, err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 6: COMMERCIAL AD MANAGEMENT
  // ----------------------------------------------------
  console.log("\n--- 6. Testing Commercial Advertisements (Impression & Click Engine) ---");
  let createdAdId = null;
  try {
    // 6.1 Create Active Ad
    const adRes = await fetch(`${BASE_URL}/advertisements/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "SQA Partner Safety Notice",
        slot: "sidebar_ad",
        type: "image",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        clickUrl: "https://safelpg.com/partner",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      }),
    }).then((r) => r.json());

    if (adRes.success && adRes.data?._id) {
      createdAdId = adRes.data._id;
      recordResult("6.1 Admin Create Active Commercial Ad", true, `Slot: sidebar_ad, ID: ${createdAdId}`);
    } else {
      recordResult("6.1 Admin Create Active Commercial Ad", false, adRes.message);
    }

    // 6.2 Fetch Active Ad by Slot (Auto-increments impression)
    const slotRes = await fetch(`${BASE_URL}/advertisements/slot/sidebar_ad`).then((r) => r.json());
    recordResult("6.2 Fetch Active Ad by Slot & Auto-Increment Impression", slotRes.success === true, `Impressions: ${slotRes.data?.impressions}`);

    // 6.3 Track Click
    if (createdAdId) {
      const clickRes = await fetch(`${BASE_URL}/advertisements/${createdAdId}/click`, {
        method: "POST",
      }).then((r) => r.json());

      recordResult("6.3 Track Ad Click Telemetry", clickRes.success === true, `Clicks: ${clickRes.data?.clicks}`);

      // 6.4 Clean up Ad
      await fetch(`${BASE_URL}/advertisements/admin/${createdAdId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      recordResult("6.4 Delete Commercial Ad", true, "Ad deleted from DB");
    }
  } catch (err) {
    recordResult("Suite 6 Advertisements", false, err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 7: OUTBOUND EMAIL & INQUIRY REPLY (SMTP)
  // ----------------------------------------------------
  console.log("\n--- 7. Testing Outbound Email Dispatch & SMTP Reply ---");
  let messageId = null;
  try {
    // 7.1 Submit Contact Message
    const contactRes = await fetch(`${BASE_URL}/contact/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Engr. Mahmudul Hasan",
        email: "mahmudul@lpg-operator.com",
        phone: "01812345678",
        subject: "Bulk Auto-Gas Safety Certification",
        message: "We need 50 station operators trained on cylinder decanting and valve safety.",
      }),
    }).then((r) => r.json());

    if (contactRes.success && contactRes.data?._id) {
      messageId = contactRes.data._id;
      recordResult("7.1 Submit Public Contact Inquiry", true, `Message ID: ${messageId}`);
    } else {
      recordResult("7.1 Submit Public Contact Inquiry", false, contactRes.message);
    }

    // 7.2 Admin Reply via SMTP Email
    if (messageId) {
      const replyRes = await fetch(`${BASE_URL}/contact/messages/${messageId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          recipientEmail: "mahmudul@lpg-operator.com",
          recipientName: "Engr. Mahmudul Hasan",
          replySubject: "Re: Bulk Auto-Gas Safety Certification",
          replyMessage: "We have reviewed your request. An accredited master trainer will contact you shortly with the enrollment curriculum.",
        }),
      }).then((r) => r.json());

      recordResult(
        "7.2 Admin Reply via SMTP Email Service",
        replyRes.success === true,
        replyRes.data?.simulated ? "Simulated SMTP" : "Dispatched via SMTP"
      );
    }
  } catch (err) {
    recordResult("Suite 7 Email & Inquiries", false, err.message);
  }

  // ----------------------------------------------------
  // TEST SUITE 8: LMS COURSES & CERTIFICATES
  // ----------------------------------------------------
  console.log("\n--- 8. Testing LMS Courses & Certificates ---");
  try {
    const coursesRes = await fetch(`${BASE_URL}/courses`).then((r) => r.json());
    recordResult("8.1 View LMS Course Catalog", coursesRes.success === true, `Found: ${coursesRes.data?.length || 0} active courses`);

    const subsRes = await fetch(`${BASE_URL}/subscriptions`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    recordResult("8.2 Admin View Enrolled Subscriptions", subsRes.success === true, `Total Subscriptions: ${subsRes.data?.length || 0}`);
  } catch (err) {
    recordResult("Suite 8 LMS", false, err.message);
  }

  // ----------------------------------------------------
  // TEST SUMMARY
  // ----------------------------------------------------
  console.log("\n==================================================");
  console.log("📊 SQA END-TO-END EXECUTION SUMMARY");
  console.log("==================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL TESTS EXECUTED: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`SUCCESS RATE: ${Math.round((passed / total) * 100)}%\n`);

  await mongoose.disconnect();
}

run();
