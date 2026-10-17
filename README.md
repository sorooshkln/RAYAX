# پروژه مشترک رایاکس

منبع اصلی صفحات در `src` قرار دارد. فایل‌های `outputs` خروجی تولیدشده‌اند و مستقیم ویرایش نمی‌شوند.

- `src/shared/`: هدر، فوتر، آیکن‌ها، دیالوگ‌ها، فونت و استایل مشترک
- `src/pages/`: محتوای هر صفحه
- `src/scripts/`: بخش‌های مرتب‌شده تعامل‌ها؛ ترتیب در `src/pages.json`
- `src/assets/`: فونت‌ها، لوگو، تصاویر و ویدیوی محلی
- `docs/decisions.md`: تصمیم‌های قطعی و کوتاه
- `docs/design-system.md`: مرجع تفصیلی

## اجرا

فقط Python 3 لازم است؛ نصب پکیج یا Node.js لازم نیست.

```sh
python3 scripts/check.py
python3 scripts/build.py
python3 -m http.server 8001 --directory outputs
```

پیش‌نمایش ماژولار: `http://localhost:8001/rayax-product/index.html`

```sh
python3 scripts/build.py --package
```

خروجی نهایی: HTML مستقل، ZIP صفحه و `rayax-project.zip` شامل ساختار کامل قابل توسعه.

برای صفحه جدیدِ درخواستی:

```sh
python3 scripts/new-page.py category --title 'دسته‌بندی محصولات'
```

سپس فقط محتوای صفحه و تعامل‌های اختصاصی را توسعه دهید. پوسته مشترک حفظ می‌شود.

کنترل مرورگر برای عامل Codex در `scripts/browser-checks.mjs` آماده است. جزئیات تنظیم مصرف و محدودیت‌ها در `docs/efficiency-setup.md` ثبت می‌شود.
