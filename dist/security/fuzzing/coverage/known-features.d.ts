/**
 * Known Features Universe
 *
 * Enumerates all dispatch points across bash, AWK, SED, and JQ
 * that are instrumented with coverage tracking.
 */
/** Command flag features auto-generated from flagsForFuzzing metadata */
export declare const CMD_FLAG_FEATURES: readonly string[];
/** Bash command node types dispatched in interpreter.executeCommand() */
export declare const BASH_CMD_FEATURES: readonly ["bash:cmd:SimpleCommand", "bash:cmd:If", "bash:cmd:For", "bash:cmd:CStyleFor", "bash:cmd:While", "bash:cmd:Until", "bash:cmd:Case", "bash:cmd:Subshell", "bash:cmd:Group", "bash:cmd:FunctionDef", "bash:cmd:ArithmeticCommand", "bash:cmd:ConditionalCommand"];
/** Bash builtin commands dispatched in builtin-dispatch.ts */
export declare const BASH_BUILTIN_FEATURES: readonly ["bash:builtin:export", "bash:builtin:unset", "bash:builtin:exit", "bash:builtin:local", "bash:builtin:set", "bash:builtin:break", "bash:builtin:continue", "bash:builtin:return", "bash:builtin:eval", "bash:builtin:shift", "bash:builtin:getopts", "bash:builtin:compgen", "bash:builtin:complete", "bash:builtin:compopt", "bash:builtin:pushd", "bash:builtin:popd", "bash:builtin:dirs", "bash:builtin:source", "bash:builtin:.", "bash:builtin:read", "bash:builtin:mapfile", "bash:builtin:readarray", "bash:builtin:declare", "bash:builtin:typeset", "bash:builtin:readonly", "bash:builtin:cd", "bash:builtin::", "bash:builtin:true", "bash:builtin:false", "bash:builtin:let", "bash:builtin:command", "bash:builtin:builtin", "bash:builtin:shopt", "bash:builtin:exec", "bash:builtin:wait", "bash:builtin:type", "bash:builtin:hash", "bash:builtin:help", "bash:builtin:[", "bash:builtin:test"];
/** Bash expansion operations instrumented in expansion handlers */
export declare const BASH_EXPANSION_FEATURES: readonly ["bash:expansion:default_value", "bash:expansion:assign_default", "bash:expansion:error_if_unset", "bash:expansion:use_alternative", "bash:expansion:pattern_removal", "bash:expansion:pattern_replacement", "bash:expansion:length", "bash:expansion:substring", "bash:expansion:case_modification", "bash:expansion:transform", "bash:expansion:indirection", "bash:expansion:array_keys", "bash:expansion:var_name_prefix", "bash:expansion:tilde", "bash:expansion:word_glob", "bash:expansion:word_split"];
/** AWK statement types dispatched in statements.ts */
export declare const AWK_STMT_FEATURES: readonly ["awk:stmt:expr_stmt", "awk:stmt:print", "awk:stmt:printf", "awk:stmt:if", "awk:stmt:while", "awk:stmt:do_while", "awk:stmt:for", "awk:stmt:for_in", "awk:stmt:break", "awk:stmt:continue", "awk:stmt:next", "awk:stmt:nextfile", "awk:stmt:exit", "awk:stmt:return", "awk:stmt:delete", "awk:stmt:block"];
/** AWK expression types dispatched in expressions.ts */
export declare const AWK_EXPR_FEATURES: readonly ["awk:expr:number", "awk:expr:string", "awk:expr:regex", "awk:expr:field", "awk:expr:variable", "awk:expr:array_access", "awk:expr:binary", "awk:expr:unary", "awk:expr:ternary", "awk:expr:call", "awk:expr:assignment", "awk:expr:pre_increment", "awk:expr:pre_decrement", "awk:expr:post_increment", "awk:expr:post_decrement", "awk:expr:in", "awk:expr:getline", "awk:expr:tuple"];
/** SED command types dispatched in executor.ts */
export declare const SED_CMD_FEATURES: readonly ["sed:cmd:substitute", "sed:cmd:print", "sed:cmd:printFirstLine", "sed:cmd:delete", "sed:cmd:deleteFirstLine", "sed:cmd:append", "sed:cmd:insert", "sed:cmd:change", "sed:cmd:hold", "sed:cmd:holdAppend", "sed:cmd:get", "sed:cmd:getAppend", "sed:cmd:exchange", "sed:cmd:next", "sed:cmd:nextAppend", "sed:cmd:quit", "sed:cmd:quitSilent", "sed:cmd:transliterate", "sed:cmd:lineNumber", "sed:cmd:branch", "sed:cmd:branchOnSubst", "sed:cmd:branchOnNoSubst", "sed:cmd:label", "sed:cmd:zap", "sed:cmd:group", "sed:cmd:list", "sed:cmd:printFilename", "sed:cmd:version", "sed:cmd:readFile", "sed:cmd:readFileLine", "sed:cmd:writeFile", "sed:cmd:writeFirstLine", "sed:cmd:execute"];
/** JQ/query-engine AST node types dispatched in evaluator.ts */
export declare const JQ_NODE_FEATURES: readonly ["jq:node:Identity", "jq:node:Field", "jq:node:Index", "jq:node:Slice", "jq:node:Iterate", "jq:node:Pipe", "jq:node:Comma", "jq:node:Literal", "jq:node:Array", "jq:node:Object", "jq:node:Paren", "jq:node:BinaryOp", "jq:node:UnaryOp", "jq:node:Cond", "jq:node:Try", "jq:node:Call", "jq:node:VarBind", "jq:node:VarRef", "jq:node:Recurse", "jq:node:Optional", "jq:node:StringInterp", "jq:node:UpdateOp", "jq:node:Reduce", "jq:node:Foreach", "jq:node:Label", "jq:node:Break", "jq:node:Def"];
/** All known features combined */
export declare const ALL_KNOWN_FEATURES: readonly string[];
/** Feature categories for reporting */
export declare const FEATURE_CATEGORIES: Record<string, readonly string[]>;
