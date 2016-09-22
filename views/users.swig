{% extends "base.swig" %}

{% block title %}
Users
{% endblock %}

{% block content %}
<h1>Users</h1>
<table>
    <thead>
    <tr>
        <td>Username</td>
        <td>Action</td>
    </tr>
    </thead>
    <tbody>
    {% for user in users %}
    <tr class="{% if user.checked_in %}checked_in{% endif %}">    
        <td>{{ user.username }}</td> 
        <td>
            <form action="/admin/{{ token }}/checkin/{{ user.id }}" method="post">
                <button type="submit">check in</button>
            </form>
        </td> 
    </tr>
    {% endfor %} 
    </tbody>
</table>
{% endblock %}
