# Profile Page - Quick Testing Guide

## 🧪 5-Minute Quick Test

Follow these steps to verify all features work:

### Step 1: Navigate to Profile (15 seconds)
```
1. Open Speaken.AI app
2. Log in if needed
3. Click "Profile" in navigation
4. ✓ Page loads with your info
5. ✓ Avatar shows (or initials)
6. ✓ All fields populated
```

### Step 2: Test Change Detection (30 seconds)
```
1. Edit your name (add a letter)
2. ✓ Orange warning appears at bottom
3. ✓ "Save Changes" button turns blue
4. ✓ "Cancel" button turns blue
5. Click "Cancel"
6. ✓ Toast: "Changes discarded"
7. ✓ Name reverts to original
8. ✓ Warning disappears
```

### Step 3: Test Avatar Upload (45 seconds)
```
1. Click camera icon on avatar
2. ✓ File picker opens
3. Select an image file
4. ✓ Preview appears immediately
5. ✓ Toast: "Avatar preview updated"
6. ✓ Orange warning appears
7. Click "Remove Preview"
8. ✓ Preview clears
9. Upload again
10. Click "Save Changes"
11. ✓ Spinner appears
12. ✓ Toast: "Profile updated successfully! ✅"
13. ✓ Avatar now permanent
```

### Step 4: Test Validation (1 minute)
```
1. Clear the full name field
2. Click outside field
3. ✓ Red border appears
4. ✓ Error: "Full name is required"
5. Type one letter
6. ✓ Error changes to "Name must be at least 2 characters"
7. Type a second letter
8. ✓ Error disappears
9. ✓ Border returns to normal

10. Edit email to "notanemail"
11. Click outside
12. ✓ Red border appears
13. ✓ Error: "Please enter a valid email address"
14. Fix email to valid format
15. ✓ Error disappears

16. Type 500 characters in bio
17. ✓ Counter shows (500/500)
18. Try to type more
19. ✓ Prevented (maxLength)
```

### Step 5: Test Password Change (1.5 minutes)
```
1. Click "Change Password" button
2. ✓ Modal opens
3. Leave all fields empty
4. Click "Change Password"
5. ✓ Three error messages appear

6. Enter "current123" in current password
7. Click eye icon
8. ✓ Password becomes visible
9. Click eye icon again
10. ✓ Password hidden again

11. Enter "weak" in new password
12. Click outside
13. ✓ Error: "Password must be at least 8 characters"

14. Enter "password" (8 chars, all lowercase)
15. ✓ Error: "Password must contain uppercase, lowercase, and number"

16. Enter "Password123" in new password
17. Enter "Password123" in current password too
18. ✓ Error: "New password must be different from current password"

19. Fix current password to "current123"
20. Keep new password as "Password123"
21. Enter "Password456" in confirm
22. ✓ Error: "Passwords do not match"

23. Fix confirm to "Password123"
24. Click "Change Password"
25. ✓ Spinner appears
26. ✓ Modal closes after 1.5 seconds
27. ✓ Toast: "Password changed successfully! 🔒"
28. Click "Change Password" again
29. ✓ All fields are empty
```

### Step 6: Test Complete Save Flow (1 minute)
```
1. Make several changes:
   - Edit name
   - Edit email
   - Edit phone
   - Edit bio
   - Change learning goal
   - Change level
2. ✓ Orange warning visible
3. ✓ Save button enabled
4. Click "Save Changes"
5. ✓ Spinner appears: "Saving Changes..."
6. ✓ Button disabled while saving
7. Wait 1.5 seconds
8. ✓ Toast: "Profile updated successfully! ✅"
9. ✓ Warning disappears
10. ✓ Save button disabled again
11. ✓ All changes committed
```

---

## 🎯 Visual Verification Checklist

Use this to verify the UI looks correct:

### Layout & Spacing:
- [ ] Page has gradient background (blue → white)
- [ ] Cards have white background
- [ ] Cards have rounded corners (24px radius)
- [ ] Cards have subtle shadows
- [ ] Sections have 24px margin between them
- [ ] Form fields have 24px gap
- [ ] Page has bottom padding for mobile nav

### Avatar Section:
- [ ] Avatar is 128px × 128px (w-32 h-32)
- [ ] Avatar has blue ring (ring-4 ring-primary/20)
- [ ] Camera icon is in bottom-right corner
- [ ] Camera button is blue gradient
- [ ] Camera button has shadow
- [ ] "Upload your photo" heading visible
- [ ] Instructions text visible
- [ ] Two buttons: "Choose Image" and "Remove Preview"
- [ ] Remove button only shows when preview exists

### Personal Information Section:
- [ ] Section title "Personal Information"
- [ ] 2 columns on desktop, 1 on mobile
- [ ] Icons visible in each field (left side)
- [ ] Required fields have red asterisk
- [ ] All inputs have rounded corners (12px)
- [ ] Inputs have proper padding
- [ ] Bio textarea expands with content

### Learning Preferences Section:
- [ ] Section title "Learning Preferences"
- [ ] 2 dropdowns side by side (desktop)
- [ ] Dropdowns stack on mobile
- [ ] Dropdown arrows visible
- [ ] Values displayed correctly

### Security Section:
- [ ] Section title "Security"
- [ ] Shield icon visible (blue background)
- [ ] Description text visible
- [ ] "Change Password" button with lock icon

### Action Buttons:
- [ ] Two buttons: Save and Cancel
- [ ] Save button is primary blue when enabled
- [ ] Save button is gray when disabled
- [ ] Cancel button is outline style
- [ ] Both buttons are same width (flex-1)
- [ ] Buttons stack on mobile
- [ ] Buttons have 24px gap between them

### Unsaved Changes Warning:
- [ ] Only visible when changes made
- [ ] Orange background color
- [ ] Orange border
- [ ] Alert icon (orange)
- [ ] Warning text clear
- [ ] Positioned at bottom

### Password Modal:
- [ ] Modal centers on screen
- [ ] Backdrop is semi-transparent black
- [ ] Modal has white background
- [ ] Modal has rounded corners
- [ ] Lock icon in title
- [ ] Description text visible
- [ ] Three password fields
- [ ] Eye icons on right side of each field
- [ ] Helper text below new password
- [ ] Cancel and Change buttons at bottom
- [ ] Close X button in top-right

### Error States:
- [ ] Red border on invalid fields
- [ ] Red alert icon with error text
- [ ] Error text is red
- [ ] Error appears below field
- [ ] Error fades in smoothly

### Loading States:
- [ ] Spinner rotates continuously
- [ ] Text changes to "Saving Changes..."
- [ ] Button disabled during save
- [ ] Cursor shows not-allowed

### Toast Notifications:
- [ ] Appear in top-right corner
- [ ] Have appropriate colors (green/red/blue/orange)
- [ ] Show for 3-5 seconds
- [ ] Can be dismissed
- [ ] Slide in from right
- [ ] Include emoji or icon

---

## 🐛 Common Issues & Solutions

### Issue: Save button always disabled
**Solution**: Make ANY change to a field. The button only enables when you modify something.

### Issue: Error won't clear
**Solution**: Make sure you're typing a valid value. Error clears automatically when valid.

### Issue: Avatar upload not working
**Solution**: 
1. Check file size (<5MB)
2. Make sure it's an image file (JPG, PNG, GIF)
3. Click "Save Changes" to apply the preview

### Issue: Password change fails
**Solution**: Check all requirements:
- Current password entered
- New password 8+ characters
- Contains uppercase, lowercase, number
- Confirm matches new password
- New ≠ Current

### Issue: Bio won't accept more text
**Solution**: This is correct behavior. Bio has 500 character limit.

### Issue: Phone number shows error
**Solution**: Phone must be 10+ characters and only contain: numbers, spaces, +, -, (, )

### Issue: Email shows error
**Solution**: Email must have format: name@domain.com

---

## ✅ Success Criteria

Your Profile Page is working correctly if:

1. ✓ All fields can be edited
2. ✓ Changes are detected immediately
3. ✓ Validation shows errors for invalid data
4. ✓ Errors clear when data becomes valid
5. ✓ Save button only works when needed
6. ✓ Cancel reverts all changes
7. ✓ Avatar upload shows preview
8. ✓ Avatar applies after save
9. ✓ Password modal opens
10. ✓ Password validation works
11. ✓ Password change succeeds
12. ✓ Toast appears for all actions
13. ✓ Loading spinners show
14. ✓ Unsaved warning appears/disappears
15. ✓ Responsive on mobile
16. ✓ Keyboard navigation works
17. ✓ No console errors
18. ✓ Data persists after save

---

## 📱 Device Testing

### Desktop (Chrome/Firefox/Safari):
- [ ] Test at 1920×1080 resolution
- [ ] Test at 1366×768 resolution
- [ ] Hover effects work
- [ ] Click interactions work
- [ ] Keyboard navigation works
- [ ] No layout issues

### Tablet (iPad/Android Tablet):
- [ ] Test in portrait mode
- [ ] Test in landscape mode
- [ ] Touch targets are large enough
- [ ] No horizontal scroll
- [ ] Columns adjust properly

### Mobile (iPhone/Android Phone):
- [ ] Test in portrait mode
- [ ] Single column layout
- [ ] Buttons stack vertically
- [ ] Avatar centered
- [ ] Bottom nav doesn't overlap content
- [ ] Modal fits screen
- [ ] Easy to tap all buttons

---

## 🎉 Final Verification

**Run this 30-second test:**

1. Navigate to Profile page
2. Upload new avatar (preview shows)
3. Edit name, email, and bio
4. Click "Save Changes"
5. See success toast
6. Avatar and fields updated
7. Click "Change Password"
8. Enter valid password info
9. Click "Change Password"
10. See success toast
11. Modal closes

**If all 11 steps work**: ✅ **Profile Page is PERFECT!**

---

**Testing Time**: ~5-7 minutes total  
**Automated Tests**: Not included (manual testing only)  
**Browser Support**: Chrome, Firefox, Safari, Edge  
**Mobile Support**: iOS Safari, Chrome Android  
**Status**: Ready for Production Testing 🚀
