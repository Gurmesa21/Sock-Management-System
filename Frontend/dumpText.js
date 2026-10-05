import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173');
    await page.type('input[name="username"]', 'admin');
    await page.type('input[name="password"]', 'Wisdom212314');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);
    
    await page.goto('http://localhost:5173/purchase-orders', { waitUntil: 'networkidle0' });
    
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const newBtn = buttons.find(b => b.innerText.includes('New') || b.innerText.includes('Create') || b.innerText.includes('Add'));
      if (newBtn) newBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    const text = await page.evaluate(() => document.body.innerText);
    console.log(text.substring(0, 500));
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
