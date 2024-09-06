class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanho: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanho: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanho: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];
        
        this.animaisPermitidos = {
            LEAO: { tamanho: 3, biomas: ["savana"] },
            LEOPARDO: { tamanho: 2, biomas: ["savana"] },
            CROCODILO: { tamanho: 3, biomas: ["rio"] },
            MACACO: { tamanho: 1, biomas: ["savana", "floresta"] },
            GAZELA: { tamanho: 2, biomas: ["savana"] },
            HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"] }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const { tamanho: tamanhoAnimal, biomas: biomasPermitidos } = this.animaisPermitidos[animal];
        let recintosViaveis = [];

        for (const recinto of this.recintos) {
            const { numero, bioma, tamanho, animais } = recinto;

            if (!biomasPermitidos.includes(bioma)) {
                continue;
            }

            const ocupacaoAtual = animais.reduce((acc, { especie, quantidade }) => {
                const tamanhoEspecie = this.animaisPermitidos[especie].tamanho;
                return acc + tamanhoEspecie * quantidade;
            }, 0);

            if (this.ehCarnivoro(animal) && animais.length > 0 && animais[0].especie !== animal) {
                continue;
            }

            if (animal === "HIPOPOTAMO" && animais.length > 0 && bioma !== "savana e rio") {
                continue;
            }

            if (animal === "MACACO" && quantidade === 1 && animais.length === 0) {
                continue;
            }

            let espacoNecessario = tamanhoAnimal * quantidade;
            if (animais.length > 0 && animais[0].especie !== animal) {
                espacoNecessario += 1;  // 1 espaço extra para múltiplas espécies
            }

            const espacoDisponivel = tamanho - ocupacaoAtual;
            if (espacoDisponivel >= espacoNecessario) {
                recintosViaveis.push({ numero, espacoLivre: espacoDisponivel - espacoNecessario, tamanho });
            }
        }

        // Ordenar os recintos primeiro pelo número, mas dando prioridade aos recintos mais adequados (bioma savana e rio)
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        if (recintosViaveis.length > 0) {
            const formatados = recintosViaveis.map(recinto =>
                `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanho})`
            );
            return { erro: null, recintosViaveis: formatados };
        } else {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }
    }

    ehCarnivoro(animal) {
        return ["LEAO", "LEOPARDO", "CROCODILO"].includes(animal);
    }
}

export { RecintosZoo as RecintosZoo };
