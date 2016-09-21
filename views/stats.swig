{% extends "base.swig" %}

{% block title %}
Leaderboard
{% endblock %}

{% block content %}
<h1>Leaderboard</h1>
<ol>
    {% for user in users %}
    <li>{{ user.time }} - {{ user.user }}</li>
    {% endfor %}
</ol>
{% endblock %}
