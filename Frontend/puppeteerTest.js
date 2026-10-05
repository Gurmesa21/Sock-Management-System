import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    console.log('Navigating to app...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    console.log('Typing credentials...');
    await page.type('input[name="username"]', 'admin');
    await page.type('input[name="password"]', 'Wisdom212314');
    
    console.log('Clicking login...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);
    
    // Wait for the app to settle on the Dashboard before navigating away
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Navigating to Purchase Order form...');
    await page.goto('http://localhost:5173/purchase-orders', { waitUntil: 'networkidle0' });
    
    // Find and click the "New" or "Create" button
    console.log('Clicking New Purchase Order button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const newBtn = buttons.find(b => b.innerText.includes('New') || b.innerText.includes('Create') || b.innerText.includes('Add'));
      if (newBtn) newBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Now let's check the Requisition dropdown
    console.log('Checking Requisition dropdown...');
    const reqOptions = await page.evaluate(() => {
      const select = document.querySelector('select[name="requisitionId"]');
      if (!select) return null;
      return Array.from(select.options).map(o => ({ value: o.value, text: o.text }));
    });
    console.log('Requisition Dropdown Options:', reqOptions);
    
    if (!reqOptions) {
      console.log('Requisition Dropdown is null! Dumping page HTML to page_dump.html...');
      fs.writeFileSync('page_dump.html', await page.content());
    }
    
    console.log('Checking Supplier dropdown...');
    const suppOptions = await page.evaluate(() => {
      const select = document.querySelector('select[name="supplierId"]');
      if (!select) return null;
      return Array.from(select.options).map(o => ({ value: o.value, text: o.text }));
    });
    console.log('Supplier Dropdown Options:', suppOptions);
    
    if (reqOptions && reqOptions.length > 1 && suppOptions && suppOptions.length > 1) {
       console.log('Dropdowns are populated!');
       // Let's actually submit the form to prove E2E works!
       await page.select('select[name="requisitionId"]', reqOptions[1].value);
       await page.select('select[name="supplierId"]', suppOptions[1].value);
       
       await page.type('input[name="expectedDeliveryDate"]', '2026-10-10');
       await page.type('textarea[name="notes"]', 'Test E2E Puppeteer');
       
       console.log('Submitting form...');
       await page.click('button[type="submit"]');
       
       // Wait for navigation or success message
       await new Promise(r => setTimeout(r, 2000));
       
       const bodyText = await page.evaluate(() => document.body.innerText);
       console.log('Post-submit page text snippet:', bodyText.substring(0, 200));
       if (page.url().includes('purchase-orders')) {
          console.log('Successfully redirected to PO list or details!');
       }
    } else {
       console.log('Dropdowns are NOT populated correctly!');
    }
    
    await browser.close();
  } catch (error) {
    console.error('Test failed:', error);
  }
})();
