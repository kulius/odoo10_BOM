# -*- coding: utf-8 -*-

{
    'name': "Tea Backend Theme",
    'author': "Rain.Wen",
    'website': "",
    'sequence': 1,
    'installable': True,
    'application': True,
    'auto_install': False,
    'summary': u"""
        Backend theme for Odoo 10.0 community edition.
        """,
    'description': u"""
		Backend theme for Odoo 10.0 community edition.
		
		Beautiful login page.
		
		it's very efficient when it runs in different terminals
		
		user/pass: demo
    """,
    "category": "Themes/Backend",
    'version': '1.0',

    'depends': [
        'web',
    ],
    'data': [
        'templates/assets.xml',
        'templates/backend.xml',
        'views/page_login.xml',
    ],
    'live_test_url': 'http://113.57.198.202:8069/web?db=tea',
    'images': ['static/description/main_screenshot.png'],
}
