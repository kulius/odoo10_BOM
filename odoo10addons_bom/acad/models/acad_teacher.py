from openerp import models, fields, api

class AcadTeacher(models.Model):
    _name="acad.teacher"
    name=fields.Char()

    course_ids=fields.One2many("acad.course","teacher_id")