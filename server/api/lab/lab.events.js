/**
 * Lab model events
 */

'use strict';

import {EventEmitter} from 'events';
import Lab from './lab.model';
var LabEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LabEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Lab.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    LabEvents.emit(event + ':' + doc._id, doc);
    LabEvents.emit(event, doc);
  };
}

export default LabEvents;
