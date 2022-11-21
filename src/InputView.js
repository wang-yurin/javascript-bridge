const { Console } = require("@woowacourse/mission-utils");
const { BridgeSize, MoveInput, CommandInput } = require("./Utils");
const BridgeRandomNumberGenerator = require("./BridgeRandomNumberGenerator");
const BridgeMaker = require("./BridgeMaker");
const BridgeGame = require("./BridgeGame");
const OutputView = require("./OutputView");
const Player = require("./Player");

const InputView = {
  readBridgeSize() {
    Console.readLine("다리의 길이를 입력해주세요.\n", (inputSize) => {
      const bridgeSize = new BridgeSize(inputSize);
      const size = bridgeSize.makeStringToNumber();
      Player.sizeUpdate(size);

      const generater = BridgeRandomNumberGenerator.generate;
      this.bridgeShape = BridgeMaker.makeBridge(size, generater);

      this.readMoving();
    });
  },

  /**
   * 사용자가 이동할 칸을 입력받는다.
   */
  readMoving() {
    Console.readLine("이동할 칸을 선택해주세요. (위: U, 아래: D)\n", (move) => {
      new MoveInput(move);
      const correct = new BridgeGame().move(this.bridgeShape, move);
      Player.stateUpdate(move, correct);

      OutputView.printMap();

      correct ? this.readMoving(this.bridgeShape) : this.readGameCommand();
    });
  },

  /**
   * 사용자가 게임을 다시 시도할지 종료할지 여부를 입력받는다.
   */
  readGameCommand() {
    Console.readLine(
      "\n게임을 다시 시도할지 여부를 입력해주세요. (재시도: R, 종료: Q)\n",
      (command) => {
        new CommandInput(command);

        new BridgeGame().retry(command)
          ? (Player.reset(), this.readMoving(this.bridgeShape))
          : OutputView.printResult();
      }
    );
  },
};

module.exports = InputView;
