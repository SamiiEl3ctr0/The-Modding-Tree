addLayer("e", {
    name: "existence points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#9f9fff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "existence points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.65, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
         let mult = new Decimal(1)
        if (hasUpgrade('e', 13)) mult = mult.times(upgradeEffect('e', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "E", description: "E: Reset for existence points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
        title: "Exist once.",
        description: "Multiply points by 2",
        cost: new Decimal(2),
        },
        12: {
            title: "Exist twice.",
            description: "Multiply points based on existence points.",
            cost: new Decimal(5),
            effect() {
                return player[this.layer].points.add(1).pow(0.75)
            },
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        13: {
            title: "Exist more.",
            description: "Multiply existence points based on points.",
            cost: new Decimal(10),
            effect() {
                return player.points.add(1).pow(0.15)
            },
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
    },
    milestones: {
        1: {
            requirementDescription: "100 EP",
            effectDescription: "gain 100% of existence points per second",
            done() { return player.e.points.gte(100) }
        },
    },
    passiveGeneration() {
        let pg = 0;
        if (hasMilestone('e',1)) pg=1;
        return pg;
    },
    layerShown(){return true}
})
