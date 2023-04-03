class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    static feedForward(givenInputs, network){
        
        let outputs =Level.feedForward(
            givenInputs,network.levels[0]
        );

        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                outputs, network.levels[i]
            );
        }

        return outputs;
    }

    static mutate(network, amount = 1) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i], 
                    Math.random() * 2 - 1, 
                    amount
                );
            }

            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j], 
                        Math.random() * 2 - 1, 
                        amount
                    );
                }
            }
        });
    }

}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);

    }

    // LOGIQUE DE LA NN
    // on initialise les poids et les biais
    // on calcule la somme des entrées pondérées
    // on calcule la sortie du neurone
    // ALGORITHME DE LA NN
    // ws + b = 0
    // ws => weigth, sensor(input)
    // b => bias

    // PLANE EQUATION 
    // w0 sO + W1 s1 + W2 s2 + ... + Wn sn + b = 0
    // w => weigth
    // s => sensor
    // b => bias


    // level => niveau de la NN
    // pour chaque neurone du niveau
    //      on initialise les poids et les biais
    // biais => valeur de seuil
    static #randomize(level) {
        //
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for(let i = 0; i < level.biases.length; i++){
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    // givenInputs => tableau de valeurs d'entrée
    // level => niveau de la NN
    // NN => réseau de neurones
    // pour chaque neurone du niveau
    //      on calcule la somme des entrées pondérées
    //      si la somme est supérieure au biais
    //          on met la valeur de sortie à 1
    //      sinon
    //          on met la valeur de sortie à 0

    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            if (sum > level.biases[i]){
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}