/**
 * @summary traverse-parents
 *
 * @version 3.0.0
 * @since 1.0.0
 *
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

/**
 * Finds parent based on the validity of the `cb` function
 *
 * @memberof module:@aofl/component-utils
 *
 * @param {HTMLElement} node
 * @param {Function} cb
 *
 * @return {(HTMLElement|Boolean)} Returns a HTMLElement matching the pattern defined in cb or false.
 */
const traverseParents = (node, cb) => {
  let parent = node;

  while (parent !== null) {
    if (parent.assignedSlot) {
      parent = parent.assignedSlot;
    } else if (typeof parent.tagName === 'undefined' && typeof parent.host !== 'undefined') {
      parent = parent.host;
    } else if (parent.parentNode) {
      parent = parent.parentNode;
    } else {
      break;
    }

    if (cb(parent)) {
      return parent;
    }
  }
  return false;
};

/**
 * Finds parent method with matching signature
 *
 * @memberof module:@aofl/component-utils
 * @param {HTMLElement} node
 * @param {*} args
 * @return {Object}
 */
const findParent = (node, ...args) => {
  return traverseParents(node, (parent) => {
    let found = true;

    for (let i = 0; i < args.length; i++) {
      if (typeof parent[args[i]] === 'undefined') {
        found = false;
        break;
      }
    }

    return found;
  });
};

/**
 * Finds parent method with matching attributes
 *
 * @memberof module:@aofl/component-utils
 * @param {HTMLElement} node
 * @param {*} args
 * @return {Object}
 */
const findParentByAttributes = (node, ...args) => {
  return traverseParents(node, (parent) => {
    let found = true;
    for (let i = 0; i < args.length; i++) {
      if (typeof parent.hasAttribute === 'undefined' || !parent.hasAttribute(args[i])) {
        found = false;
        break;
      }
    }

    return found;
  });
};

export {
  findParent,
  findParentByAttributes,
  traverseParents
};

