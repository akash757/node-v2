import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const { expression } = calcBody;
    const allowedCharsRegex =
      /^[-+]?[0-9]*\.?[0-9]+([-+*/]?([0-9]*\.?[0-9]+))*$/;
    if (!allowedCharsRegex.test(expression)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const tokens = expression
      .split(/(\+|\-|\*|\/|\(|\))/)
      .filter((token) => token.trim() !== '');
    const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
    };

    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    tokens.forEach((token) => {
      if (/\d+/.test(token)) {
        outputQueue.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '('
        ) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          outputQueue.push(operatorStack.pop()!);
        }
        if (operatorStack.length === 0) {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid expression provided',
              error: 'Bad Request',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        operatorStack.pop();
      } else {
        while (
          operatorStack.length > 0 &&
          precedence[token] <=
            precedence[operatorStack[operatorStack.length - 1]]
        ) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      }
    });

    while (operatorStack.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const operator = operatorStack.pop()!;
      if (operator === '(' || operator === ')') {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid expression provided',
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      outputQueue.push(operator);
    }
    const stack: number[] = [];

    outputQueue.forEach((token) => {
      if (/\d+/.test(token)) {
        stack.push(parseFloat(token));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const b = stack.pop()!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const a = stack.pop()!;
        switch (token) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            stack.push(a / b);
            break;
          default:
            throw new HttpException(
              {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid expression provided',
                error: 'Bad Request',
              },
              HttpStatus.BAD_REQUEST,
            );
        }
      }
    });

    if (stack.length !== 1) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (isNaN(stack[0])) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return stack[0];
  }
}
