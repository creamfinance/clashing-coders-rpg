{% extends "base.swig" %}

{% block title %}
Users
{% endblock %}

{% block content %}
<h1>Users</h1>
<div class="row">
    <a href="/admin/{{token}}/register" class="btn btn-primary">Register</a>
</div>
<div class="row">
    <table class="table table-striped table-condensed">
        <thead>
            <tr>
                <td>Name</td>
                <td>Email</td>
                <td>Action</td>
        </thead>
        <tbody>
            {% for user in users %}
            <tr class="{% if user.checked_in %}success{% endif %}">    
                <td>{{ user.name }} {% if user.from_abroad %}(Abroad){% endif %}</td>
                <td>{{ user.username }}</td> 
                <td>
                    {% if ! user.checked_in %}
                    <form action="/admin/{{ token }}/checkin/{{ user.id }}" method="post">
                        <button type="submit" class="btn btn-xs btn-default">check in</button>
                    </form>
                    {% endif %}
                </td> 
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>
{% endblock %}
