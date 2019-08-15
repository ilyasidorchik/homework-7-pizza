import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

export default (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_NEW_ORDER:
      const { id, recipe } = payload;

      return [
        ...state,
        {
          id: id,
          ingredients: [],
          position: steps[0],
          recipe: recipe
        }
      ];

    case MOVE_ORDER_NEXT:
      return state.map(pizza => {
        return (pizza.id === payload) ? { ...pizza, position: getNewPosition(pizza, 1) } : pizza;
      });

    case MOVE_ORDER_BACK:
      return state.map(pizza => {
        return (pizza.id === payload) ? { ...pizza, position: getNewPosition(pizza, -1) } : pizza;
      });

    case ADD_INGREDIENT:
      const { from, ingredient } = payload;
      
      let flag = false;
      return state.map(pizza => {
        if (pizza.position === from && !flag) {
          flag = true;

          if (pizza.recipe.indexOf(ingredient) !== -1 && pizza.ingredients.indexOf(ingredient) === -1) {
            return {
              ...pizza,
              ingredients: [...pizza.ingredients, ingredient]
            };        
          }
          else return pizza;
        }
        else return pizza;
      });

    default:
      return state;
  }
};

const steps = [
  'clients',
  'conveyor_1',
  'conveyor_2',
  'conveyor_3',
  'conveyor_4',
  'finish'
];

const getNewPosition = (pizza, step) => {
  const stepIndex = steps.indexOf(pizza.position);
  const stepNextIndex = stepIndex + step;
  const newPosition = steps[stepNextIndex];

  let isMoving = ((stepNextIndex > 0 && stepNextIndex < steps.length - 1)
                 || pizza.recipe.length === pizza.ingredients.length) ? true : false;

  return isMoving ? newPosition : pizza.position;
};

export const getOrdersFor = (state, position) =>
  state.orders.filter(order => order.position === position);