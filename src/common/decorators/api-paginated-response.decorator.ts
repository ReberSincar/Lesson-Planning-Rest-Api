import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PageDto } from "src/common/pagination/page-meta.dto";

export const ApiPaginatedResponse = <TModel extends Type<any>>(
    model: TModel, description?: string
) => {
    return applyDecorators(
        ApiExtraModels(PageDto),
        ApiOkResponse({
            description: description ?? "Successfully received model list",
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PageDto) },
                    {
                        properties: {
                            data: {
                                type: "array",
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
};