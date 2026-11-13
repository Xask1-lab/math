#!/usr/bin/env python3
# Збирає index.html (PWA для GitHub Pages) із джерела src/math.html.
# Запуск із кореня репозиторію:  python3 build.py
# Після збирання підніміть VERSION у sw.js, щоб оновлення дійшло до користувачів.
src=open('src/math.html',encoding='utf-8').read()
i=src.index('<style>'); head_extra=src[:i].replace('<meta name="claude:viewport-fit-sides" content="cover">\n',''); body=src[i:]
page=f'''<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- PWA: маніфест, кольори панелей та іконки -->
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#edf0f5" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f131a" media="(prefers-color-scheme: dark)">
<meta name="description" content="Калькулятор з рівняннями й нерівностями, графіки функцій і понад 60 тем уроків з тестами.">
<link rel="icon" href="icons/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Математика">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
{head_extra}<style>
/* Базове скидання: відступи під «чубчик» і системні панелі телефона */
:root{{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}
img{{max-width:100%}}
</style>
</head>
<body>
{body}
<script>
/* Реєстрація сервіс-воркера: програма працює офлайн після першого відкриття */
if('serviceWorker' in navigator){{window.addEventListener('load',()=>{{navigator.serviceWorker.register('sw.js').catch(e=>console.warn('SW:',e))}})}}
</script>
</body>
</html>
'''
open('index.html','w',encoding='utf-8').write(page)
print('built',len(page))
