class InRamInterface extends ModelInterface {
    constructor(config) {
        super();
        this.cacheWhereEnable = false;

        if(config.cacheWhereEnable !== false) {
            this.cacheWhereEnable = true;
            this.cacheWhere = [];
        }
        
        //Operators
        this.operators = {
            '>': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] > value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            '>=': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] >= value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            '<': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] < value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            '<=': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] <= value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            '!=': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] != value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            'like': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && String(el[key]).includes(String(value))) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            'whereIn': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && value.includes(el[key])) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            }
        };

        this.data = [];
        this.next = 1;
        if(Array.isArray(config.data)) {
            this.data = this.normalize(config.data);
        }

        return this;
    }

    clear() {
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        this.next = 1;
        this.data = [];

        return this;
    }

    //Normalize raw data
    /**
     * @param raw
     */
    normalize(raw) {
        if(raw === false || raw === undefined || raw === null) {
            return [];
        }

        let data = [];
        let index = 1;
        raw.forEach(row => {
            if(row && row.id != undefined) {
                data[row.id] = row;
            } else {
                row.id = index;
                data.push(row);
            }
            index++;
        });

        return data.filter(function (el) {
            return el != null;
        });
    }

    set(index, field, value) {
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        this.data[index][field] = value;

        return this;
    }

    update(index, options) {
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        for(const[key, value] of Object.entries(options)) {
            this.set(index, key, value);
        }

        return this;
    }

    delete(index) {
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        if(!index) {
            return false;
        } 

        this.data.splice(index, 1);
        this.data = this.normalize(this.data);

        return this;
    }

    get(index = false) {
        if(index in this.data) {
            return this.data.find(el => el.id == index);
        }

        return [];
    }

    insert(data) {
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        this.next++;
        this.data[this.next] = data;
        this.data = this.normalize(this.data);

        return this;
    }

    all() {
        return this.data;
    }

    //Find function
    find(key, value, operator = false, data) {
        if(operator === false) {
            let result = [];
            data.forEach(el => {
                if(key in el && el[key] == value) {
                    if(el.id && el.id !== null && el.id !== undefined) {
                        result[el.id] = el;
                    } else {
                        result.push(el);
                    }
                }
            });

            return result;
        }

        if(typeof operator !== 'string' && !(operator instanceof String)) {
            return [];
        }

        if(operator == '=') {
            return this.find(key, value, false, data);
        }

        if(!(operator in this.operators)) {
            return [];
        }

        return this.operators[operator](key, value, data);
    }

    where(options) {
        let data = this.data;
        let optionStringNatation = '';

        if(this.cacheWhereEnable) {
            optionStringNatation = options.toString();

            if(optionStringNatation in this.cacheWhere) {
                return this.cacheWhere[optionStringNatation];
            }
        }

        options.forEach(option => {
            if(data.length == 0) {
                return;
            }

            let operator = '=';
            if(option.length > 2) {
                option[1] = option[1].replace(/\s/g, '');
                operator = option[1];
            }

            data = this.find(option[0], option[2] ? option[2] : option[1], operator, data);            
        });

        let result = [];
        if(data.length > 0) {
            data.forEach(e => {
                if(e != null && e && e !== undefined) {
                    result.push(e);
                }
            });
        }

        if(this.cacheWhereEnable) {
            this.cacheWhere[optionStringNatation] = result;
        }
            
        return result;
    }
}

module.exports = InRamInterface;
