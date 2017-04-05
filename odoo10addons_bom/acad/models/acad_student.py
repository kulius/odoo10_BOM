from openerp import models, fields, api

class AcadStudent(models.Model):
    _name="acad.student"
    name=fields.Char()

    course_ids = fields.Many2many("acad.course")