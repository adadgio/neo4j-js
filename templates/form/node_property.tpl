<div class="form-group clearfix" data-type="node-property" data-index="{{index}}">
    <div class="row">
        <div class="col-xs-5">
            <select class="form-control input-xs" name="property[{{index}}]">
                {{#each mappedProperties}}
                    <option value="{{@key}}">{{@key}}</option>
                {{/each}}
            </select>
        </div>

        <div class="col-xs-5">
            <input class="form-control input-xs" type="text" name="value[{{index}}]" placeholder="Property value..." value="" autocomplete="off" />
        </div>

        <div class="col-xs-2">
            <a href="" data-type="remove-node-property" data-index="{{index}}" title="Remove property"><i class="fa fa-close"></i></a>
        </div>
        <div class="clearfix"></div>
    </div>
</div>
