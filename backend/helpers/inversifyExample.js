var inversify = require('inversify');
require('reflect-metadata');

var TYPES = {
  Ninja: 'Ninja',
  Katana: 'Katana',
  Shuriken: 'Shuriken',
};

class Katana {
  hit() {
    return 'cut!';
  }
}

class Shuriken {
  throw() {
    return 'hit!';
  }
}

class Ninja {
  constructor(katana, shuriken) {
    this._katana = katana;
    this._shuriken = shuriken;
  }
  fight() {
    return this._katana.hit();
  }
  sneak() {
    return this._shuriken.throw();
  }
}

// class Ninja extends OldNinja {
//   constructor() {
//     super();
//   }
// }

// Declare as injectable and its dependencies
inversify.decorate(inversify.injectable(), Katana);
inversify.decorate(inversify.injectable(), Shuriken);
inversify.decorate(inversify.injectable(), Ninja);
inversify.decorate(inversify.inject(TYPES.Katana), Ninja, 0);
inversify.decorate(inversify.inject(TYPES.Shuriken), Ninja, 1);

// Declare bindings
var container = new inversify.Container();
container
  .bind(TYPES.Ninja)
  .to(Ninja)
  .inSingletonScope();
container.bind(TYPES.Katana).to(Katana);
container.bind(TYPES.Shuriken).to(Shuriken);

// Resolve dependencies
var ninja1 = container.get(TYPES.Ninja);
var ninja2 = container.get(TYPES.Ninja);

console.log(ninja1);
console.log(ninja2);
console.log(ninja2 === ninja1);

/*

@xanf_ua 
По поводу DI в действии.
В видео есть ошибка `toConstructor` создает не синглтон, а делает что-то другое, возвращает функцию, догадываюсь, что конструктор ))
Насколько понял тут подойтет .inSingletonScope();

```
container
  .bind(TYPES.Ninja)
  .to(Ninja)
  .inSingletonScope();
```

Есть еще такой вопрос. 

К примеру в проекте исользую модуль модуль rc, объект который хорошо бы иметь в доступе по всему проекту.
Помещаю его объект в контейнер через .toConstantValue( <object> ).

Если с базой даных работаю через sequelize и результатом должен быть объект sequelize, который синглтон. Мне

Насколько оправжано испольоваь так настройки всей системы, 
а если экстраполировать на другие возмжные подобные случаи что делать?

Отсюда вопрос. К примеру во всем проекте как раз таки нужно использовать такие синглтоны. 
Для обычных настроек подходит .toConstantValue( <object> ).
модуль с сервисом
обертка

*/
