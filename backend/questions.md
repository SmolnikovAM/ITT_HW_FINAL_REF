Еше вопрос по DI.
К примеру, есть sequelize.
Его экземпляр помещаем в контейнер и теперь он без труда доступен во всем проекте.

Далее необходимо создать теблицу/модель через функцию sequelize.define
К примеру:
const User = sequelize.define('user', {
name: { type: Sequelize.STRING },
password: { type: Sequelize.STRING },
.....other fields
});
Раньше экспортировали User и подключали через import/require, то как это сделать сейчас?

Пришло в голову следующее решение:

файл model/user/index.js

import Sequelize from 'sequelize';

export default sequelize =>
sequelize.define('user', {
name: { type: Sequelize.STRING },
password: { type: Sequelize.STRING },
.....other fields
});

файл model/user/inversify.userModel.js

import userCreate from '.';

export const LOCALTYPES = {
UserModel: Symbol('UserModel'),
};

export function register({ container, TYPES }) {
const user = userCreate(container.get(TYPES.Sequelize));
container.bind(TYPES.UserModel).toConstantValue(user);
}
То есть через операцию `toConstantValue(user)`так как функция userCreate не класс.

Смущает, что во время построений связей происходит инициализация container.get(TYPES.Sequelize)

Нормальный ли это способ и есть ли другое решение?
