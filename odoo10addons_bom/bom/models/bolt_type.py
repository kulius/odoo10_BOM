# -*- coding: utf-8 -*-
from odoo import api, fields, models


class BoltType(models.Model):
    _name = 'bolt.type'

    name = fields.Char()

