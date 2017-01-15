'use strict';

import mongoose from 'mongoose';

var LabSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Lab', LabSchema);
