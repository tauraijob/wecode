# 🎨 Logo Upload Guide

## 📍 Where to Upload Your Logo

### **Location:** `public/logo/` directory

**Full Path:** `C:\Users\USER\Desktop\wecodezw\public\logo\`

## 🚀 Quick Steps

1. **Navigate to the logo directory:**
   ```
   C:\Users\USER\Desktop\wecodezw\public\logo\
   ```

2. **Place your logo file** with one of these names:
   - `logo.svg` ⭐ (Recommended - best quality)
   - `logo.png` (With transparent background)
   - `logo.webp` (Modern format)
   - `logo.jpg` (If no transparency needed)

3. **Refresh your browser** - The logo will appear automatically!

## 📋 Logo Specifications

### Recommended Settings:
- **Format:** SVG (best) or PNG with transparency
- **Size:** 200-300px width × 40-60px height
- **Background:** Transparent (recommended)
- **Colors:** Should work on dark backgrounds (header uses navy-950)
- **File Size:** Under 100KB for fast loading

### Supported Formats:
- ✅ **SVG** (Scalable Vector Graphics) - **Best Choice**
- ✅ PNG (with transparency)
- ✅ WebP (modern format)
- ✅ JPG/JPEG (if no transparency needed)

## 🔄 How It Works

The system automatically:
1. ✅ Checks for logo files in `public/logo/` directory
2. ✅ Tries formats in order: `logo.svg` → `logo.png` → `logo.webp` → `logo.jpg`
3. ✅ Uses the first one found
4. ✅ Falls back to text logo "WZ" if no logo exists

## 📂 Directory Structure

```
wecodezw/
├── public/
│   ├── logo/              ← PUT YOUR LOGO HERE
│   │   ├── logo.svg       ← Your logo file
│   │   └── README.md
│   ├── uploads/
│   └── ...
```

## 🎯 Where Logo Appears

The logo will automatically appear in:
- ✅ Main website header (default layout)
- ✅ Admin dashboard sidebar
- ✅ User dashboard sidebar
- ✅ Mobile navigation menus

## 💡 Tips

- **SVG is best** - scales perfectly at any size
- **Use transparent background** - works on any color
- **Test on mobile** - ensure it's readable at small sizes
- **Keep it simple** - complex logos may not render well at small sizes
- **File name must be exact:** `logo.svg` or `logo.png` (case-sensitive)

## 🔍 Testing

After uploading:
1. Visit: `http://localhost:3000/`
2. Check the header - your logo should appear
3. If it doesn't:
   - ✅ Check file name is exactly `logo.svg` or `logo.png`
   - ✅ Check file is in `public/logo/` directory
   - ✅ Clear browser cache (Ctrl+Shift+R)
   - ✅ Check browser console for errors

## 📝 Example

**Before:**
```
Header shows: [WZ] WeCodeZW
```

**After (with logo.svg uploaded):**
```
Header shows: [Your Logo Image] WeCodeZW
```

---

**That's it!** Just place your logo file in `public/logo/` and name it `logo.svg` or `logo.png` - it will appear automatically! 🎉
