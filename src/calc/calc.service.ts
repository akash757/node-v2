import { Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const { expression } = calcBody;
    const allowedCharsRegex =
      /^[-+]?[0-9]*\.?[0-9]+([-+*/]?([0-9]*\.?[0-9]+))*$/;
    if (!allowedCharsRegex.test(expression)) {
      throw new Error('Invalid characters in expression');
    }
    function operate(operator: string, a: number, b: number) {
      switch (operator) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          return a / b;
      }
    }
    const tokens = expression.split('').filter((d) => d !== ' ');
    const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
    };
    const stack = [];
    for (const token of tokens) {
      if (token.match(/\d+/)) {
        stack.push(parseFloat(token));
      } else if (token in precedence) {
        while (
          stack.length >= 2 &&
          precedence[token] <= precedence[stack[stack.length - 1]]
        ) {
          const b = stack.pop();
          const a = stack.pop();
          stack.push(operate(a, stack.pop(), b));
        }
        stack.push(token);
      }
    }
    while (stack.length > 1) {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(operate(a, stack.pop(), b));
    }
    const result = stack.pop();
    if (isNaN(result)) {
      throw new Error('Invalid expression');
    }

    return result;
  }
}
