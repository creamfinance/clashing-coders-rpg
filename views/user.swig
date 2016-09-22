{% extends "base.swig" %}

{% block title %}
User {{ user.username }}
{% endblock %}

{% block content %}
<div class="credentials">
    <div class="username">{{ user.username }}</div>
    <div class="password">{{ user.password }}</div>
</div>
{% endblock %}
