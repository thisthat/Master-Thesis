package weka.api;


import java.util.Random;

import weka.classifiers.bayes.BayesNet;
import weka.classifiers.bayes.NaiveBayes;
import weka.classifiers.evaluation.Evaluation;
import weka.classifiers.functions.supportVector.RegSMO;
import weka.classifiers.trees.J48;
import weka.core.*;
import weka.core.converters.ConverterUtils.DataSource;

public class LoadSaveData {
	public static void main(String[] args) throws Exception {
		String path = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export\\merge.arff";
		DataSource source = new DataSource(path);
		Instances dataset = source.getDataSet();
		//Set the index to the last column
		dataset.setClassIndex(dataset.numAttributes() - 1);
		
		//CREATE
		
		//NaiveBayes tree = new NaiveBayes();
		//tree.buildClassifier(dataset);
		//

		//READ 
		NaiveBayes tree = (NaiveBayes) SerializationHelper.read("test_model.model");
		
		
		path = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export\\dataset_test_3.arff";
		DataSource source2 = new DataSource(path);
		Instances dataset2 = source2.getDataSet();
		dataset2.setClassIndex(dataset2.numAttributes() - 1);
		
		//EVALUATION
		Evaluation eval = new Evaluation(dataset);
		eval.crossValidateModel(tree, dataset2, 10, new Random());
		//eval.evaluateModel(tree, dataset2);
		//System.out.println(eval.toMatrixString());
		System.out.println(eval.toSummaryString());
		
		//PREDICTION
		/*int num = 0;
		for(int i = 0; i < dataset2.numInstances(); i++){
			double actualClass = dataset2.instance(i).classValue();
			String actual = dataset2.classAttribute().value((int) actualClass);
			
			Instance newInst = dataset2.instance(i);
			double predictClass = tree.classifyInstance(newInst);
			String predict = dataset2.classAttribute().value((int) predictClass);
			System.out.println(actual + " :: " + predict);
			if(actual.equals(predict)){ num++ ; }
		}
		System.out.println(num + "/" + dataset2.numInstances() + "=" + ((double)num/(double)dataset2.numInstances()*100) + "%");*/
		
		SerializationHelper.write("test_model.model", tree);
		
	}
}
