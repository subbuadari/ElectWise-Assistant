/**
 * Lightweight inline testing suite for ElectWise.
 * Runs on page load if ?test=true is appended to URL.
 */

const Tests = {
  passed: 0,
  failed: 0,
  
  assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      this.passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      this.failed++;
    }
  },

  async runAll() {
    console.log("--- Starting ElectWise Test Suite ---");
    
    // 1. Test Sanitizer
    this.assert(
      sanitizeInput("<script>alert('xss')</script>") === "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;", 
      "Input Sanitizer blocks script tags"
    );

    // 2. Test Navigation
    navigateTo("faq");
    const faqSection = document.getElementById("faq");
    this.assert(faqSection.classList.contains("active"), "Navigation function updates active section");
    
    // 3. Test Answer Caching
    answerCache.set("test query", "Cached Response");
    this.assert(answerCache.has("test query"), "Answer cache stores values");
    this.assert(answerCache.get("test query") === "Cached Response", "Answer cache retrieves correct values");

    // 4. Test Markdown parser
    const html = markdownToHtml("**Bold** and *Italic*");
    this.assert(html.includes("<strong>Bold</strong>") && html.includes("<em>Italic</em>"), "Markdown parser handles bold and italic");
    
    // 5. Test Fallback Knowledge Base
    const fallbackAnswer = getFallbackAnswer("how do I register");
    this.assert(fallbackAnswer.includes("vote.gov"), "Fallback knowledge base returns correct default answers");

    console.log(`--- Test Suite Complete: ${this.passed} Passed, ${this.failed} Failed ---`);
    if (this.failed > 0) {
      console.error("Some tests failed. Check implementation.");
    }
  }
};

// Auto-run if ?test=true is in URL
if (window.location.search.includes('test=true')) {
  setTimeout(() => Tests.runAll(), 1000);
}
