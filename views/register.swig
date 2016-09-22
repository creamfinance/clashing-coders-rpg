{% extends "base.swig" %}

{% block title %}
New User
{% endblock %}

{% block content %}
<form action="/admin/{{ token }}/register" method="post">
    <div>Username: <input type="text" name="username" /></div>
    <div>Email: <input type="text" name="email" /></div>
    <div>A password will be generated for you.</div>
    <button type="submit">Register</button>
</form>
{% endblock %}
