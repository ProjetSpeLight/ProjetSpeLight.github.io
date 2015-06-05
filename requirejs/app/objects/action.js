/**
  * This module implements the differents actions that can occur after an event on a switch or a button
  *
  * Structure of the JSON file related to the declaration of actions
  *
  * {
  *     ... // Definition of the switch or button
  *     action: {
  *         groupId : {Number} // Id of the group of the target, i.e. which type of objects it is (mirror, filter, platform...)
  *         id : {Number} // Id of the target within its group
  *         actionName: {String} // Name of the action to define
  *         args: {Array} // Array of the arguments necessary to the action
  *             {
  *                 arg1:
  *                 arg2:
  *                 ...
  *             }
  * }
  *
  * Structure of the object created from the JSON file
  * {
  *     "actionName": {pointeur de fonction}
  *     "args": {
  *                 "target": {reference vers l'objet}
  *                 ... = liste des arguments
  *             }
  * }
  *
  **/
define([], function () {


    function getFunctionAction(name) {
        switch (name) {
            case 'actionCreateObject':
            case 'actionDeleteObject':
                return actionDeleteObject;
            case 'actionMoveObject':
                return actionMoveObject;
            case 'actionChangeObjectColor':
                return actionChangeObjectColor;
            default:
                return null;
        }
    }

    function getOppositeFunctionAction(name) {
        switch (name) {
            case 'actionCreateObject':
            case 'actionDeleteObject':
                return actionCreateObject;
            case 'actionMoveObject':
                return actionMoveObject;
            default:
                return null;
        }
    }

    function computeOppositeArgs(args, actionName) {
        switch (actionName) {
            case 'actionMoveObject':
                return {
                    "x": -args.x,
                    "y": -args.y
                };
            default:
                return args;

        }
    }



    /// @function createAction
    /// Creates and returns an array composed of the different elements of an action : the target, the action function and its argument(s) from the JSON file
    /// @return {Object} an object containing the necessary data to perform the action when the signal is activated
    /// @param {Object} Object created from the JSON parse
    function createAction(data, manager) {
        // We get the object on which the action is
        var object = manager.getObject(data.groupId, data.id);
        var args = {};
        if (data.args != null) {
            args = data.args;
        }
        var oppositeArgs = computeOppositeArgs(args, data.actionName);
        args.target = object;
        oppositeArgs.target = object;
        if (data.actionName == "actionMoveObject")
            return {
                "onActionName": getFunctionAction(data.actionName),
                "offActionName": getFunctionAction(data.actionName),
                "onArgs": oppositeArgs,
                "offArgs": args
            }
        else
            return {
                "onActionName": getFunctionAction(data.actionName),
                "offActionName": getOppositeFunctionAction(data.actionName),
                "onArgs": args,
                "offArgs": oppositeArgs
            }
    }

    function actionMoveObject(args) {
        args.target.body.x += args.x;
        args.target.body.y += args.y;
    }

    function actionDeleteObject(args) {
        args.target.kill();
    }

    function actionCreateObject(args) {
        args.target.revive();
    }

    function actionChangeMirrorOrientation(args) {

    }

    function actionChangeObjectColor(args) {
        var i = args.colors.indexOf(args.target.color);
        args.target.color = agrs.colors[(i + 1) % (args.colors.length)].color;
    }


    return {
        createAction: createAction,
        actionMoveObject: actionMoveObject,
        actionDeleteObject: actionDeleteObject,
        actionCreateObject: actionCreateObject,
        actionChangeMirrorOrientation: actionChangeMirrorOrientation,
        actionChangeObjectColor: actionChangeObjectColor
    }

});




