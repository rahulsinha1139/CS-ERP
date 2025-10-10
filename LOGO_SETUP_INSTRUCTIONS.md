# 🎨 Company Logo Setup Instructions

## 📋 Quick Setup

To add Pragnya Pradhan & Associates' logo to the invoices and application UI, follow these simple steps:

### **Step 1: Prepare the Logo File**
- Use the blue CS logo image provided
- Recommended format: PNG with transparent background
- Recommended size: 200x200 pixels (or similar square dimensions)
- File size: Keep under 500KB for optimal loading

### **Step 2: Save the Logo**
1. Navigate to the project directory:
   ```
   C:\Users\rishu\OneDrive\Desktop\Projects\final-cs-invoice\cs-erp-app\public\images\
   ```

2. If the `images` folder doesn't exist, create it:
   ```
   C:\Users\rishu\OneDrive\Desktop\Projects\final-cs-invoice\cs-erp-app\public\images\
   ```

3. Save the logo file as:
   ```
   company-logo.png
   ```

4. **Full path should be:**
   ```
   C:\Users\rishu\OneDrive\Desktop\Projects\final-cs-invoice\cs-erp-app\public\images\company-logo.png
   ```

### **Step 3: Verify Setup**
The logo will automatically appear in:
- ✅ Invoice PDFs (top-left corner with company name)
- ✅ Application UI (configured in database as `/images/company-logo.png`)
- ✅ Login page branding (if configured)

### **Alternative: Use a Different Filename**
If you prefer a different filename:

1. Save the logo with your preferred name (e.g., `pradhan-logo.png`)
2. Update the database company record:
   - Open Prisma Studio: `cd cs-erp-app && npm run db:studio`
   - Navigate to Company table
   - Update the `logo` field to: `/images/pradhan-logo.png`
   - Click Save

---

## 🔧 **Technical Details**

### **How It Works:**
- The database stores the logo path in the Company model
- Current path from cleanup script: `/images/company-logo.png`
- Public folder serves static assets at runtime
- PDF engine loads logo using the stored path
- Application UI components fetch logo from company settings

### **Database Configuration:**
```typescript
company: {
  name: 'PRAGNYA PRADHAN & ASSOCIATES',
  logo: '/images/company-logo.png',  // ← Path stored in database
  pan: 'AMEPP4323R',
  // ... other fields
}
```

### **PDF Engine Integration:**
The logo is automatically included in generated invoices:
```typescript
// In pdf-engine-pragnya.ts
<div class="logo">
  <img src="${data.company.logo}" alt="${data.company.name} Logo" />
</div>
```

---

## ✅ **Verification Checklist**

After saving the logo, verify:

- [ ] File exists at: `cs-erp-app/public/images/company-logo.png`
- [ ] File size is under 500KB
- [ ] Image format is PNG (preferably with transparent background)
- [ ] Database `Company.logo` field points to: `/images/company-logo.png`
- [ ] Generate a test invoice to see the logo in PDF
- [ ] Check application UI for logo visibility

---

## 🆘 **Troubleshooting**

### **Logo not appearing in PDF:**
1. Check that the file path is correct: `/images/company-logo.png`
2. Ensure the file is in the `public/images/` folder (not `src/images/`)
3. Restart the development server: `npm run dev`
4. Clear browser cache and regenerate the invoice

### **Logo too large/small:**
1. Edit the logo image to 200x200 pixels
2. Or adjust CSS in `pdf-engine-pragnya.ts`:
   ```css
   .logo {
     width: 80px;  /* Adjust this value */
     height: 80px; /* And this value */
   }
   ```

### **Logo not loading:**
1. Check browser console for errors
2. Verify the public folder structure
3. Make sure the server is running from `cs-erp-app` directory

---

## 🎯 **Next Steps**

After logo setup:
1. ✅ Test invoice generation with logo
2. ✅ Run production build: `npm run build`
3. ✅ Deploy to Vercel
4. ✅ Client handover and training

---

**Note:** The logo path is stored in the database, so once configured, it will persist across all invoices and UI components automatically.
