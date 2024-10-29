---
title: Widgets Demo Page
sidebar_left: "Left Sidebar"
sidebar_right: "Right Sidebar"
---

{% from "widgets/contactForm.njk" import contactForm %}

<h1>Widgets Demo Page</h1>
A page for displaying and developing widget

{{ contactForm() }}
