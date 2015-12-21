<form action="" method="post" id="node-form" data-type="node-form">
    {{#if node._id}}
        <input class="form-control" type="hidden" name="_id" value="{{node._id}}" />
    {{/if}}

    <div class="form-group" data-type="node-labels">
        <span class="help">Labels</span><br />
        {{#each mappedLabels}}
        <div class="checkbox">
            <label>
                <input type="checkbox"{{#ifIn this ../node._labels }} checked="checked"{{/ifIn}} name="label[{{@index}}]" value="{{this}}" />
                {{this}}
            </label>
        </div>
        {{/each}}
    </div>

    <div class="form-group separator"></div>

    <div data-type="node-properties">
        <div class="form-group">
            <span class="help">Properties</span> &nbsp;
            <a class="add-node-property" href="" data-type="add-node-property" title="Add property" data-toggle="tooltip" data-placement="right"><i class="fa fa-plus-square"></i></a>
        </div>

        {{#each node._properties}}
        <div class="form-group clearfix" data-type="node-property" data-index="{{@index}}">
            <div class="row">
                <div class="col-xs-5">
                    <select class="form-control input-xs" name="property[{{@index}}]">
                        {{#each ../mappedProperties}}
                            <option value="{{@key}}"{{#ifCond @../key @key}} selected="selected"{{/ifCond}}>{{@key}}</option>
                        {{/each}}
                    </select>
                </div>

                <div class="col-xs-5">
                    <input class="form-control input-xs" type="text" name="value[{{@index}}]" placeholder="Property value..." value="{{this}}" />
                </div>

                <div class="col-xs-2">
                    <a href="" data-type="remove-node-property" data-index="{{@index}}" title="Remove property"><i class="fa fa-close"></i></a>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        {{/each}}
    </div>

    <div class="form-group">
        <button class="btn btn-primary btn-sm">Save</button>
    </div>
</form>
