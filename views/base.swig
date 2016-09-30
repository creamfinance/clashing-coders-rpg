<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta charset="utf-8" />
    <link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    <div class="head" style="background-color: #e92323; padding-top: 10px; padding-bottom: 10px;">
        <img src="/img/logo.png" style="width: 375px; margin-left: auto; margin-right: auto; display: block "/>
    </div>
    <div class="container">
        {% block content %}{% endblock %}
    </div>
</body>
{% block scripts %}{% endblock %}
</html>
