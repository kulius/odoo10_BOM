from openerp import models, fields, api

class AcadCourse(models.Model):
    _name="acad.course"
    name=fields.Char()

    teacher_id = fields.Many2one("acad.teacher",
                              string="teacher")

    student_ids = fields.Many2many("acad.student")