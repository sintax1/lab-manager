'use strict';

export default class AdminController {
  /*@ngInject*/
  constructor() {
    // Use the User $resource to fetch all users
    this.users = [{username:'test'}, {username:'test2'}];
  }
}
