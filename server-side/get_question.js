const express = require('express');
const methodOverride = require('method-override');
const app = express();

app.use(methodOverride('_method'));
