class Loading {
    loads = 0

    load() {
        this.loads++
    }

    unload() {
        this.loads--
    }

    isLoading() {
        return this.loads > 0
    }
}

module.exports = new Loading()
