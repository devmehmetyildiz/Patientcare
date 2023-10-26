const { sequelizeErrorCatcher } = require("./Error")
const moment = require('moment');
const NUMERATOR_LEN = 8

async function Getnumerator(next, transaction) {
    try {
        const nums = await db.filenumeratorModel.findAll()
        if (nums && Array.isArray(nums) && nums.length > 0) {
            const previous = nums[0]
            const newnumerator = await Createnewnumerator(previous.Current, next)
            await db.filenumeratorModel.update({
                Current: newnumerator
            }, { where: { Id: previous.Id } }, { transaction })
            return newnumerator
        } else {
            const newnumerator = await Createnewnumerator(_, next)
            await db.filenumeratorModel.create({
                Current: newnumerator
            }, { transaction })
            return newnumerator
        }
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function Getcurrentnumerator(next) {
    try {
        const currentDate = moment();
        const year = currentDate.format('YY');
        const month = currentDate.format('MM');
        const nums = await db.filenumeratorModel.findAll()
        if (nums && Array.isArray(nums) && nums.length > 0) {
            return nums[0].Current
        } else {
            const count = 1
            const numerator = year + month + count.toString().padStart(4, '0');
            return numerator
        }
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function Createnewnumerator(previous, next) {
    try {
        const currentDate = moment();
        const year = currentDate.format('YY');
        const month = currentDate.format('MM');
        if (previous && previous.length === NUMERATOR_LEN) {
            const previousYear = previous.slice(0, 2);
            const previousMonth = previous.slice(2, 4);
            const previousCount = parseInt(previous.slice(4), 10);
            let count;
            if (previousYear === year && previousMonth === month) {
                count = previousCount + 1;
            } else {
                count = 1
            }
            const numerator = year + month + count.toString().padStart(4, '0');
            return numerator
        } else {
            const count = 1
            const numerator = year + month + count.toString().padStart(4, '0')
            return numerator
        }
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

module.exports = {
    Getcurrentnumerator,
    Getnumerator,
    Createnewnumerator
}