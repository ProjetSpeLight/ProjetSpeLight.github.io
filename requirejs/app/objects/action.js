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
  *
  * The action is handled differently according to the type of the trigger (button or switch)
  * In the case of a button, the action is executed as long as the player stays on the button. It is the same action that is done.
  * In the case of a switch, the switch has two states (ON and OFF). Thus, we need to be able to reverse the action if the switch retuns in its original switch.
  * That is why the switch and the button are not exactly handled in the same way.
  *
  **/
define([], function () {

    /// @function getFunctionAction
    /// Returns the function corresponding to the string in argument
    function getFunctionAction(name) {
        switch (name) {
            case 'actionCreateObject':
            case 'actionDeleteObject':
                return actionDeleteObject;
            case 'actionMoveObject':
                return actionMoveObject;
            case 'actionChangeObjectColor':
                return actionChangeObjectColor;
            case 'actionChangeMirrorOrientation':
                return actionChangeMirrorOrientation;
            case 'actionPutInMovePlatform':
                return actionPutInMovePlatform;
            default:
                return null;
        }
    }

    /// @function getFunctionAction
    /// Returns the opposite function corresponding to the string in argument
    /// This function is used by the switchs
    function getOppositeFunctionAction(name) {
        switch (name) {
            case 'actionCreateObject':
            case 'actionDeleteObject':
                return actionCreateObject;
            case 'actionMoveObject':
                return actionMoveObject;
            case 'actionPutInMovePlatform':
                return actionPutInMovePlatform;
            default:
                return null;
        }
    }

    /// @function computeOppositeArgs
    /// Returns the opposite arguments for the opposite function
    /// Once again, this function is for the switchs
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
    /// This function has to be used for switchs.
    /// @return {Object} an object containing the necessary data to perform the action when the signal is activated
    /// @param {Object} Object created from the JSON parse
    function createAction(data, manager) {
        // We get the object on which the action is
        var object = manager.getObject(data.groupId, data.id);

        // We get the potential arguments for the action function
        var args = {};
        if (data.args != null) {
            args = data.args;
        }

        // This function creates an action for a switch : the action can be reversed if the switch re-change of state
        // Thus, we compute the opposite arguments for the reverse function
        var oppositeArgs = computeOppositeArgs(args, data.actionName);

        // For both arguments, we add the target of the action (the object concerned by the action)
        args.target = object;
        oppositeArgs.target = object;

        // The action 'actionPutInMovePlatform' is special. We create the moving platform in the JSON. We need to stop it at the beginning.
        // That is the purpose of the call of actionPutInMovePlatform right after this comment.
        if (data.actionName == 'actionPutInMovePlatform') {
            actionPutInMovePlatform(args);
        }

        // Finally, we force the state for the action of creation/destruction.
        // State ON = object created
        // State OFF = object destructed
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

    /// @function createActionButton
    /// Creates and returns an array composed of the different elements of an action : the target, the action function and its argument(s) from the JSON file
    /// This function has to be used for buttons.
    /// @return {Object} an object containing the necessary data to perform the action when the signal is activated
    /// @param {Object} Object created from the JSON parse
    function createActionButton(data, manager) {
        // We get the object on which the action is
        var object = manager.getObject(data.groupId, data.id);
        var args = {};
        if (data.args != null) {
            args = data.args;
        }
        args.target = object;

        var actionName = getFunctionAction(data.actionName);
        if (data.actionName == 'actionPutInMovePlatform') {
            actionPutInMovePlatform(args);
        }

        return {
            "actionName": actionName,
            "args": args
        }

    }

    function actionPutInMovePlatform(args) {
        if (args.target.body.velocity.x == 0 && args.target.body.velocity.y == 0) {
            args.target.body.velocity.x = args.target.saveSpeedXAction;
            args.target.body.velocity.y = args.target.saveSpeedYAction;
        } else {
            args.target.saveSpeedXAction = args.target.body.velocity.x;
            args.target.saveSpeedYAction = args.target.body.velocity.y;
            args.target.body.velocity.x = 0;
            args.target.body.velocity.y = 0;
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
        args.target.angle += args.incr;
    }

    function actionChangeObjectColor(args) {
        var i;
        for (i = 0; i < args.colors.length; i++) {
            if (args.colors[i].color == args.target.color)
                break;
        }
        args.target.color = args.colors[(i + 1) % (args.colors.length)].color;
        if (args.target.objectType == 'switch') {
            args.target.loadTexture(args.target.objectType + args.target.color + args.target.state);

        } else if (args.target.objectType == 'platform') {
            args.target.loadTexture(args.target.objectType + args.target.color);
            args.target.spriteColor.play('move' + args.target.color);
        }
        else {
            args.target.loadTexture(args.target.objectType + args.target.color);
        }

    }


    return {
        createAction: createAction,
        createActionButton: createActionButton
    }

});




