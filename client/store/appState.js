import { observable, computed, action } from 'mobx';

export default class AppState {
  constructor({ count, name } = { count: 5, name: 'paji' }) {
    this.count = count;
    this.name = name;
  }

  @observable count;

  @observable name;

  @computed get msg() {
    return `${this.name} say count is ${this.count}`;
  }

  @action add = () => {
    this.count += 1;
  };

  @action changeName = (name) => {
    this.name = name;
  };

  // 在服务端渲染的时候，在appstate实例化之后，以json的格式来拿到
  toJson() {
    return {
      count: this.count,
      name: this.name,
    };
  }
}
