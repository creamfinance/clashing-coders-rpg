{% extends "base.swig" %}

{% block title %}
Leaderboard
{% endblock %}

{% block content %}
<div class="head" style="background-color: #e92323;padding: 15px;/* padding-bottom: 10px; *//* display: inline-block; */vertical-align: middle;">
        <img src="/img/logo.png" style="/* width: 375px; */margin-left: auto;margin-right: auto;display: inline-block;height: 90px;vertical-align: middle;">
    <h1 style="
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    margin: 0;
    margin-left: 60px;
    color: white;
">Leaderboard {% if level %}- Level {{ level }}{% endif %}</h1></div>

<div class="row">
    <table class="table table-striped">
        <thead>
            <tr>
                <td>Level</td>
                <td>Player</td>
                <td>Time</td>
        </thead>
        <tbody>
            {% for user in users %}
            <tr>
                <td>{{user.level || level}}</td><td>{{user.user}}</td><td>{{user.time}}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>
{% endblock %}
{% block scripts %}
<script type="text/javascript">
    setTimeout(function(){ window.location.reload(); }, 5000);
</script>
{% endblock %}
