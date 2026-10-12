import graphviz

g = graphviz.Digraph('Class', format='png')
g.attr(rankdir='TB', splines='spline', nodesep='0.5', ranksep='0.8', bgcolor='white', dpi='160', fontname='Helvetica')
g.attr('node', shape='plain', fontname='Helvetica', fontsize='11')
g.attr('edge', fontname='Helvetica', fontsize='10')

def cls(name, attrs, methods=(), color='#eef5ff', stereotype=None):
    rows = ''.join(f'<TR><TD ALIGN="LEFT" BORDER="0">{a}</TD></TR>' for a in attrs) or '<TR><TD BORDER="0"> </TD></TR>'
    mrows = ''.join(f'<TR><TD ALIGN="LEFT" BORDER="0">{m}</TD></TR>' for m in methods)
    st = f'<FONT POINT-SIZE="9">«{stereotype}»</FONT><BR/>' if stereotype else ''
    sep = f'<TR><TD BORDER="1" SIDES="T" CELLPADDING="0" HEIGHT="1"></TD></TR>{mrows}' if methods else ''
    label = f'''<<TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4" BGCOLOR="{color}">
<TR><TD BGCOLOR="#d7e3f4">{st}<B>{name}</B></TD></TR>
{rows}{sep}</TABLE>>'''
    g.node(name, label)

cls('User', ['- id : UUID', '- name : String', '- email : String', '- salt : String', '- passwordHash : String', '- createdAt : Date'],
    ['+ signup(name, email, password)', '+ login(email, password)', '+ logout()', '+ resetPassword(email, newPassword)', '+ changePassword(current, new)', '+ updateName(name)'], '#eaf3ff')
cls('Resume', ['- id : UUID', '- userId : UUID', '- title : String', '- templateId : String', '- createdAt : Date', '- updatedAt : Date'],
    ['+ create()', '+ update()', '+ rename(title)', '+ delete()', '+ downloadPdf()', '+ switchTemplate(id)'], '#eaf3ff')
cls('ResumeData', ['- summary : String'], ['+ toDocument()'], '#f4f0ff')
cls('PersonalInfo', ['- name : String', '- title : String', '- email : String', '- phone : String', '- location : String', '- linkedin : String', '- portfolio : String', '- photoUrl : String'], [], '#f4f0ff')
cls('Experience', ['- id : UUID', '- title : String', '- company : String', '- location : String', '- startDate : String', '- endDate : String', '- current : Boolean', '- bullets : String[]'], [], '#f4f0ff')
cls('Education', ['- id : UUID', '- degree : String', '- school : String', '- location : String', '- startDate : String', '- endDate : String', '- notes : String'], [], '#f4f0ff')
cls('Project', ['- id : UUID', '- name : String', '- description : String', '- technologies : String[]', '- link : String'], [], '#f4f0ff')
cls('Skills', ['- technical : String[]', '- soft : String[]', '- languages : String[]'], [], '#f4f0ff')
cls('Certificate', ['- id : UUID', '- name : String', '- org : String', '- date : String'], [], '#f4f0ff')
cls('Extras', ['- awards : Award[]', '- publications : Publication[]', '- volunteer : Volunteer[]', '- custom : CustomSection[]'], [], '#f4f0ff')
cls('Template', ['- id : String', '- name : String', '- layout : single | sidebar-left | band', '- colors : Object', '- skillsVariant : tags | bars', '- experienceVariant : list | timeline'], ['+ render(data)'], '#fff6e0')
cls('ContactMessage', ['- id : UUID', '- name : String', '- email : String', '- phone : String', '- subject : String', '- message : String', '- createdAt : Date'], ['+ send()'], '#eaf3ff')
cls('AuthService', ['- users : User[]', '- session : userId'], ['+ signup()', '+ login()', '+ logout()', '+ resetPassword()', '+ changePassword()'], '#e9f7e9', 'service')
cls('ResumeStorage', [], ['+ listResumes(userId)', '+ getResume(userId, id)', '+ createResume(...)', '+ updateResume(...)', '+ deleteResume(...)'], '#e9f7e9', 'service')
cls('AiService', [], ['+ generateSummary()', '+ improveSummary()', '+ improveBullet()', '+ suggestSkills()', '+ reviewResume()'], '#e9f7e9', 'service (Groq)')
cls('Validator', [], ['+ validateName()', '+ validateEmail()', '+ validatePassword()', '+ validatePhone()', '+ validateUrl()', '+ validateDate()', '+ validateText()'], '#fde9e9', 'utility')

# Relationships
g.edge('User', 'Resume', label=' owns', taillabel='1', headlabel='0..*', dir='back', arrowtail='diamond', arrowhead='none', color='#333333')
g.edge('Resume', 'ResumeData', label=' contains', taillabel='1', headlabel='1', dir='back', arrowtail='diamond', arrowhead='none', color='#333333')
for c, m in [('PersonalInfo', '1'), ('Experience', '0..*'), ('Education', '0..*'), ('Project', '0..*'), ('Skills', '1'), ('Certificate', '0..*'), ('Extras', '1')]:
    g.edge('ResumeData', c, headlabel=m, dir='back', arrowtail='diamond', arrowhead='none', color='#333333')
g.edge('Resume', 'Template', label=' uses  *..1', arrowhead='vee', style='dashed', color='#333333')
g.edge('AuthService', 'User', label=' manages', arrowhead='vee', style='dashed', color='#333333')
g.edge('ResumeStorage', 'Resume', label=' persists', arrowhead='vee', style='dashed', color='#333333')
g.edge('AiService', 'ResumeData', label=' reads', arrowhead='vee', style='dashed', color='#333333')
g.edge('Validator', 'AuthService', label=' used by', arrowhead='vee', style='dashed', color='#333333')
g.edge('Validator', 'ContactMessage', label=' used by', arrowhead='vee', style='dashed', color='#333333')

g.render('classdiagram', cleanup=True)
